package com.eigogakushu.app.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.RecordVoiceOver
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Straighten
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.eigogakushu.app.data.VocabRepository
import com.eigogakushu.app.encodePath

private fun iconForTopic(key: String): ImageVector = when (key) {
    "unit_conversion" -> Icons.Filled.Straighten
    "pronunciation_rules" -> Icons.Filled.RecordVoiceOver
    "tense_usage" -> Icons.Filled.Schedule
    else -> Icons.Filled.Schedule
}

@Composable
fun ReferenceHubScreen(navController: NavHostController) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("参照") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "戻る")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(VocabRepository.referenceTopics) { topic ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    onClick = { navController.navigate("reference_topic/${topic.key}") }
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(iconForTopic(topic.key), contentDescription = null)
                        Text(topic.title, style = MaterialTheme.typography.titleMedium)
                    }
                }
            }
            item {
                val node = VocabRepository.referenceVocabRoot.children["発音"]
                val count = node?.itemCountRecursive() ?: 0
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    onClick = { navController.navigate("category/referenceVocab/${encodePath(listOf("発音"))}") }
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Icon(Icons.Filled.RecordVoiceOver, contentDescription = null)
                        Column {
                            Text("発音注意単語・弱形発音", style = MaterialTheme.typography.titleMedium)
                            Text("${count}件 - 発音を確認できる単語リスト", style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ReferenceTopicScreen(navController: NavHostController, key: String) {
    val topic = VocabRepository.referenceTopics.firstOrNull { it.key == key }
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(topic?.title ?: "参照") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "戻る")
                    }
                }
            )
        }
    ) { padding ->
        if (topic == null) return@Scaffold
        val context = LocalContext.current
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            topic.sections.forEach { section ->
                Text(section.title, style = MaterialTheme.typography.titleLarge)
                section.imageName?.let { name ->
                    val resId = remember(name) {
                        context.resources.getIdentifier(name, "drawable", context.packageName)
                    }
                    if (resId != 0) {
                        Image(
                            painter = painterResource(resId),
                            contentDescription = section.title,
                            contentScale = ContentScale.FillWidth,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(top = 12.dp)
                        )
                    }
                }
                section.formulas.forEach { formula ->
                    Text("・$formula", modifier = Modifier.padding(top = 6.dp))
                }
                section.bullets.forEach { bullet ->
                    Text("・$bullet", modifier = Modifier.padding(top = 6.dp))
                }
                section.table?.let { table ->
                    Column(modifier = Modifier.padding(top = 12.dp)) {
                        Row {
                            table.headers.forEach { h ->
                                Text(
                                    h,
                                    modifier = Modifier
                                        .weight(1f)
                                        .padding(4.dp),
                                    style = MaterialTheme.typography.labelSmall
                                )
                            }
                        }
                        table.rows.forEach { row ->
                            Row {
                                row.forEach { cell ->
                                    Text(
                                        cell,
                                        modifier = Modifier
                                            .weight(1f)
                                            .padding(4.dp),
                                        style = MaterialTheme.typography.bodySmall
                                    )
                                }
                            }
                        }
                    }
                }
                section.note?.let { note ->
                    Text(
                        note,
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }
                Column(modifier = Modifier.padding(bottom = 20.dp)) {}
            }
        }
    }
}
