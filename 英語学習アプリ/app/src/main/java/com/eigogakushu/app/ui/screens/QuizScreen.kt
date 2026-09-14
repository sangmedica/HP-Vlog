package com.eigogakushu.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.eigogakushu.app.data.AudioPlayer
import com.eigogakushu.app.data.VocabItem
import com.eigogakushu.app.data.VocabRepository
import com.eigogakushu.app.data.WrongAnswerStore

private const val MAX_QUESTIONS = 20

private data class Question(val target: VocabItem, val choices: List<String>, val correctIndex: Int)

private fun buildQuestions(pool: List<VocabItem>, fallbackPool: List<VocabItem>): List<Question> {
    val distinctByJapanese = pool.distinctBy { it.japanese }
    val questionTargets = distinctByJapanese.shuffled().take(MAX_QUESTIONS)
    val allItems = (pool + fallbackPool).distinctBy { it.id }

    return questionTargets.map { target ->
        val wrongOptions = pickDistractors(target, allItems)
        val choices = (wrongOptions + target.japanese).shuffled()
        Question(target, choices, choices.indexOf(target.japanese))
    }
}

// 正解と紛らわしい(似た分野の)誤答を選ぶ。優先順位: ①AIが用意した専用の誤答 ②同じ小カテゴリ内の単語
// ③1つ上のカテゴリ内の単語 ④トップカテゴリ内の単語 ⑤それでも足りなければ全体からランダム
private fun pickDistractors(target: VocabItem, allItems: List<VocabItem>): List<String> {
    val result = mutableListOf<String>()
    val used = mutableSetOf(target.japanese)

    target.distractors?.forEach { d ->
        if (result.size < 3 && d.isNotBlank() && d !in used) {
            result.add(d)
            used.add(d)
        }
    }

    fun addFrom(candidates: List<VocabItem>) {
        if (result.size >= 3) return
        for (item in candidates.shuffled()) {
            if (result.size >= 3) break
            if (item.japanese in used) continue
            result.add(item.japanese)
            used.add(item.japanese)
        }
    }

    addFrom(allItems.filter { it.categoryPath == target.categoryPath })
    if (result.size < 3 && target.categoryPath.size > 1) {
        val parent = target.categoryPath.dropLast(1)
        addFrom(allItems.filter { it.categoryPath.dropLast(1) == parent })
    }
    if (result.size < 3 && target.categoryPath.isNotEmpty()) {
        val top = target.categoryPath.first()
        addFrom(allItems.filter { it.categoryPath.firstOrNull() == top })
    }
    addFrom(allItems)

    return result.take(3)
}

@Composable
fun QuizScreen(navController: NavHostController, path: List<String>, reviewMode: Boolean = false) {
    val context = LocalContext.current

    val pool: List<VocabItem>
    val title: String
    if (reviewMode) {
        pool = remember { WrongAnswerStore.reviewItems() }
        title = "復習問題"
    } else {
        var node = VocabRepository.quizRoot
        for (segment in path) {
            node = node.children[segment] ?: return
        }
        pool = remember(path) { node.allItemsRecursive() }
        title = path.lastOrNull() ?: "試験"
    }
    val fallbackPool = remember { VocabRepository.quizRoot.allItemsRecursive() }
    val questions = remember(pool) { buildQuestions(pool, fallbackPool) }

    var index by remember { mutableIntStateOf(0) }
    var score by remember { mutableIntStateOf(0) }
    var selected by remember { mutableStateOf<Int?>(null) }
    var finished by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(title) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "戻る")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            if (questions.isEmpty()) {
                Text(if (reviewMode) "復習する問題はありません。" else "この範囲には出題できる単語がありません。")
                return@Column
            }

            if (finished) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.Center
                ) {
                    Text("結果: $score / ${questions.size}", style = MaterialTheme.typography.headlineMedium)
                    Row(modifier = Modifier.padding(top = 16.dp)) {
                        Button(onClick = {
                            index = 0; score = 0; selected = null; finished = false
                        }) { Text("もう一度") }
                    }
                }
                return@Column
            }

            val q = questions[index]
            LinearProgressIndicator(
                progress = { (index + 1f) / questions.size },
                modifier = Modifier.fillMaxWidth()
            )
            Text("${index + 1} / ${questions.size}", modifier = Modifier.padding(top = 8.dp))

            Column(modifier = Modifier.padding(vertical = 24.dp)) {
                Text(q.target.english, style = MaterialTheme.typography.headlineSmall)
                if (!q.target.pronunciation.isNullOrBlank()) {
                    Text(q.target.pronunciation, style = MaterialTheme.typography.bodyMedium)
                }
                Button(onClick = {
                    q.target.audioFile?.let { AudioPlayer.play(context, "audio/$it") }
                }, modifier = Modifier.padding(top = 8.dp)) {
                    Text("発音を聞く")
                }
            }

            Text("正しい意味を選んでください", style = MaterialTheme.typography.titleSmall)

            q.choices.forEachIndexed { i, choice ->
                val isCorrect = i == q.correctIndex
                val colors = when {
                    selected == null -> ButtonDefaults.buttonColors()
                    isCorrect -> ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32))
                    i == selected -> ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828))
                    else -> ButtonDefaults.buttonColors()
                }
                Button(
                    onClick = {
                        if (selected == null) {
                            selected = i
                            if (isCorrect) {
                                score++
                                if (reviewMode) {
                                    WrongAnswerStore.clearItem(q.target.id)
                                }
                            } else {
                                WrongAnswerStore.recordWrong(q.target.id)
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    colors = colors
                ) {
                    Text(choice)
                }
            }

            if (selected != null) {
                Button(
                    onClick = {
                        if (index + 1 < questions.size) {
                            index++
                            selected = null
                        } else {
                            finished = true
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp)
                ) {
                    Text(if (index + 1 < questions.size) "次へ" else "結果を見る")
                }
            }
        }
    }
}
