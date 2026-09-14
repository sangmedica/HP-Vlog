package com.eigogakushu.app.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.eigogakushu.app.data.VocabItem

@Composable
fun VocabRow(item: VocabItem, trailingLabel: String? = null) {
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
                if (trailingLabel != null) {
                    Text(trailingLabel, style = MaterialTheme.typography.labelSmall)
                }
            }
            AudioPlayButton(audioFile = item.audioFile)
        }
    }
}
