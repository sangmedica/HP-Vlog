package com.eigogakushu.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.eigogakushu.app.data.VocabItem
import com.eigogakushu.app.data.VocabRepository
import com.eigogakushu.app.ui.components.AudioPlayButton

@Composable
fun SearchScreen(navController: NavHostController) {
    var query by remember { mutableStateOf("") }
    val results = remember(query) { VocabRepository.search(query) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("検索") },
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
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                label = { Text("日本語 または 英語で検索") },
                modifier = Modifier.fillMaxWidth()
            )

            if (query.isBlank()) {
                Text("キーワードを入力してください", modifier = Modifier.padding(top = 24.dp))
            } else if (results.isEmpty()) {
                Text("見つかりませんでした", modifier = Modifier.padding(top = 24.dp))
            } else {
                LazyColumn(
                    modifier = Modifier.padding(top = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(results) { item ->
                        SearchResultRow(item)
                    }
                }
            }
        }
    }
}

@Composable
private fun SearchResultRow(item: VocabItem) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.padding(vertical = 8.dp)) {
                Text(item.english, style = MaterialTheme.typography.titleMedium)
                if (!item.pronunciation.isNullOrBlank()) {
                    Text(item.pronunciation, style = MaterialTheme.typography.bodySmall)
                }
                Text(item.japanese, style = MaterialTheme.typography.bodyMedium)
                Text(
                    item.categoryPath.joinToString(" › "),
                    style = MaterialTheme.typography.labelSmall
                )
            }
            AudioPlayButton(audioFile = item.audioFile)
        }
    }
}
