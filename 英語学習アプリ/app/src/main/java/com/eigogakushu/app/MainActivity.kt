package com.eigogakushu.app

import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.eigogakushu.app.data.VocabRepository
import com.eigogakushu.app.data.WrongAnswerStore
import com.eigogakushu.app.ui.screens.CategoryScreen
import com.eigogakushu.app.ui.screens.HomeScreen
import com.eigogakushu.app.ui.screens.QuizScreen
import com.eigogakushu.app.ui.screens.ReferenceHubScreen
import com.eigogakushu.app.ui.screens.ReferenceTopicScreen
import com.eigogakushu.app.ui.screens.SearchScreen
import com.eigogakushu.app.ui.screens.SpecialListScreen
import com.eigogakushu.app.ui.theme.EigoGakushuTheme

const val PATH_DELIM = "␟"

fun encodePath(path: List<String>): String = Uri.encode(path.joinToString(PATH_DELIM))
fun decodePath(encoded: String): List<String> =
    if (encoded.isBlank()) emptyList() else Uri.decode(encoded).split(PATH_DELIM)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        VocabRepository.init(applicationContext)
        WrongAnswerStore.init(applicationContext)
        setContent {
            EigoGakushuTheme {
                AppNavHost()
            }
        }
    }
}

@Composable
fun AppNavHost() {
    val navController: NavHostController = rememberNavController()
    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(navController)
        }
        composable(
            route = "category/{root}/{path}",
            arguments = listOf(
                navArgument("root") { type = NavType.StringType },
                navArgument("path") { type = NavType.StringType; defaultValue = "" }
            )
        ) { backStackEntry ->
            val root = backStackEntry.arguments?.getString("root") ?: "quiz"
            val path = decodePath(backStackEntry.arguments?.getString("path") ?: "")
            CategoryScreen(navController = navController, root = root, path = path)
        }
        composable(
            route = "quiz/{path}",
            arguments = listOf(navArgument("path") { type = NavType.StringType })
        ) { backStackEntry ->
            val path = decodePath(backStackEntry.arguments?.getString("path") ?: "")
            QuizScreen(navController = navController, path = path, reviewMode = false)
        }
        composable("quiz_review") {
            QuizScreen(navController = navController, path = emptyList(), reviewMode = true)
        }
        composable("review") {
            SpecialListScreen(navController = navController, mode = "review")
        }
        composable("hall_of_fame") {
            SpecialListScreen(navController = navController, mode = "hallOfFame")
        }
        composable("search") {
            SearchScreen(navController)
        }
        composable("reference") {
            ReferenceHubScreen(navController)
        }
        composable(
            route = "reference_topic/{key}",
            arguments = listOf(navArgument("key") { type = NavType.StringType })
        ) { backStackEntry ->
            val key = backStackEntry.arguments?.getString("key") ?: ""
            ReferenceTopicScreen(navController = navController, key = key)
        }
    }
}
