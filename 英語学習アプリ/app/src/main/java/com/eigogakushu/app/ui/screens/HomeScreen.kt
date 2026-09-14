package com.eigogakushu.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import com.eigogakushu.app.data.VocabRepository
import com.eigogakushu.app.data.WrongAnswerStore
import com.eigogakushu.app.encodePath

data class HomeEntry(val title: String, val subtitle: String, val onClickRoute: String)

@Composable
fun HomeScreen(navController: NavHostController) {
    Scaffold(
        topBar = { TopAppBar(title = { Text("英語学習") }) }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Text("試験問題", style = androidx.compose.material3.MaterialTheme.typography.titleMedium)
            }
            items(VocabRepository.QUIZ_ROOT_NAMES) { name ->
                val node = VocabRepository.quizRoot.children[name]
                val count = node?.itemCountRecursive() ?: 0
                HomeCard(
                    title = name,
                    subtitle = "${count}件",
                    icon = null
                ) {
                    navController.navigate("category/quiz/${encodePath(listOf(name))}")
                }
            }
            item {
                val reviewCount = WrongAnswerStore.reviewIds().size
                HomeCard(
                    title = "復習問題",
                    subtitle = "間違えた問題(${reviewCount}件) - 正解すると一覧から消えます",
                    icon = Icons.Filled.Refresh
                ) {
                    navController.navigate("review")
                }
            }
            item {
                val hallOfFameCount = WrongAnswerStore.hallOfFameIds().size
                HomeCard(
                    title = "殿堂入り問題",
                    subtitle = "3回間違えた問題(${hallOfFameCount}件)",
                    icon = Icons.Filled.EmojiEvents
                ) {
                    navController.navigate("hall_of_fame")
                }
            }
            item {
                Text("検索", style = androidx.compose.material3.MaterialTheme.typography.titleMedium)
            }
            item {
                HomeCard(title = "単語・フレーズを検索", subtitle = "日本語 / 英語であいまい検索", icon = Icons.Filled.Search) {
                    navController.navigate("search")
                }
            }
            item {
                Text("参照", style = androidx.compose.material3.MaterialTheme.typography.titleMedium)
            }
            item {
                HomeCard(title = "単位・発声・時制の使い方", subtitle = "試験ではなく必要な時に見る資料", icon = Icons.Filled.MenuBook) {
                    navController.navigate("reference")
                }
            }
        }
    }
}

@Composable
private fun HomeCard(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector?,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth(),
        onClick = onClick,
        colors = CardDefaults.cardColors()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            if (icon != null) {
                Icon(icon, contentDescription = null)
            }
            Text(title, style = androidx.compose.material3.MaterialTheme.typography.titleMedium)
            Text(subtitle, style = androidx.compose.material3.MaterialTheme.typography.bodySmall)
        }
    }
}
