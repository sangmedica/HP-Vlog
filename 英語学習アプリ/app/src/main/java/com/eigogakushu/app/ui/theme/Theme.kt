package com.eigogakushu.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val Primary = Color(0xFF2B5CE6)
private val PrimaryDark = Color(0xFF7FA0FF)

private val LightColors = lightColorScheme(
    primary = Primary,
    secondary = Color(0xFF00897B)
)

private val DarkColors = darkColorScheme(
    primary = PrimaryDark,
    secondary = Color(0xFF4DB6AC)
)

@Composable
fun EigoGakushuTheme(content: @Composable () -> Unit) {
    val colors = if (isSystemInDarkTheme()) DarkColors else LightColors
    MaterialTheme(colorScheme = colors, content = content)
}
