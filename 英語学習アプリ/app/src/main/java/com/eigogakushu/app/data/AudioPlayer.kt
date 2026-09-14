package com.eigogakushu.app.data

import android.content.Context
import android.media.MediaPlayer

object AudioPlayer {
    private var player: MediaPlayer? = null

    fun play(context: Context, assetPath: String) {
        stop()
        try {
            val afd = context.assets.openFd(assetPath)
            player = MediaPlayer().apply {
                setDataSource(afd.fileDescriptor, afd.startOffset, afd.length)
                afd.close()
                prepare()
                start()
                setOnCompletionListener { stop() }
            }
        } catch (e: Exception) {
            stop()
        }
    }

    fun stop() {
        player?.let {
            try {
                if (it.isPlaying) it.stop()
                it.release()
            } catch (_: Exception) {
            }
        }
        player = null
    }
}
