package com.eigogakushu.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Quiz
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.eigogakushu.app.data.WrongAnswerStore
import com.eigogakushu.app.ui.components.VocabRow

@Composable
fun SpecialListScreen(navController: NavHostController, mode: String) {
    val isReview = mode == "review"
    val title = if (isReview) "復習問題" else "殿堂入り問題"
    val items = if (isReview) WrongAnswerStore.reviewItems() else WrongAnswerStore.hallOfFameItems()

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
            if (items.isEmpty()) {
                Text(
                    if (isReview) "間違えた問題はまだありません。試験で間違えるとここに表示されます。"
                    else "3回間違えた問題はまだありません。"
                )
                return@Column
            }

            if (isReview) {
                Button(
                    onClick = { navController.navigate("quiz_review") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                ) {
                    Icon(Icons.Filled.Quiz, contentDescription = null)
                    Text("  復習する(${items.size}件)")
                }
            }

            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(items) { item ->
                    val count = WrongAnswerStore.getWrongCount(item.id)
                    VocabRow(item, trailingLabel = "間違えた回数: $count 回")
                }
            }
        }
    }
}
