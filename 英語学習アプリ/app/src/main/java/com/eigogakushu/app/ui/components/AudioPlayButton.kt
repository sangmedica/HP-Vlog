package com.eigogakushu.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import com.eigogakushu.app.data.AudioPlayer

@Composable
fun AudioPlayButton(audioFile: String?) {
    val context = LocalContext.current
    IconButton(
        onClick = {
            if (audioFile != null) {
                AudioPlayer.play(context, "audio/$audioFile")
            }
        },
        enabled = audioFile != null
    ) {
        Icon(Icons.Filled.VolumeUp, contentDescription = "発音を再生")
    }
}
