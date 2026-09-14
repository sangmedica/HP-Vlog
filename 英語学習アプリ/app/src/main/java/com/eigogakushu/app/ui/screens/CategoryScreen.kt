package com.eigogakushu.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Quiz
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.IconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.eigogakushu.app.data.CategoryNode
import com.eigogakushu.app.data.VocabRepository
import com.eigogakushu.app.encodePath
import com.eigogakushu.app.ui.components.VocabRow

@Composable
fun CategoryScreen(navController: NavHostController, root: String, path: List<String>) {
    val rootNode = if (root == "quiz") VocabRepository.quizRoot else VocabRepository.referenceVocabRoot
    var node: CategoryNode = rootNode
    for (segment in path) {
        node = node.children[segment] ?: return
    }

    val title = path.lastOrNull() ?: "カテゴリ"

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
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            if (root == "quiz" && node.itemCountRecursive() > 0) {
                item {
                    Button(
                        onClick = { navController.navigate("quiz/${encodePath(path)}") },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Filled.Quiz, contentDescription = null)
                        Text("  この範囲(${node.itemCountRecursive()}件)で試験を始める")
                    }
                }
            }

            if (node.children.isNotEmpty()) {
                items(node.children.values.toList()) { child ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        onClick = { navController.navigate("category/$root/${encodePath(path + child.name)}") }
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(child.name, style = MaterialTheme.typography.titleMedium)
                            Text("${child.itemCountRecursive()}件", style = MaterialTheme.typography.bodySmall)
                        }
                    }
                }
            }

            if (node.items.isNotEmpty()) {
                items(node.items) { vocabItem ->
                    VocabRow(vocabItem)
                }
            }
        }
    }
}
