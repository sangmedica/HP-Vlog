package com.eigogakushu.app.data

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject

object VocabRepository {

    // トップレベルカテゴリのうち「試験(クイズ)」の対象とするもの
    val QUIZ_ROOT_NAMES = listOf("忘れがちな単語", "接頭語・接尾語・連結語", "便利なフレーズ")

    // トップレベルカテゴリのうち「参照(単語リスト)」として扱うもの(試験にしない)
    val REFERENCE_VOCAB_ROOT_NAMES = listOf("発音")

    private var initialized = false

    lateinit var allItems: List<VocabItem>
        private set

    lateinit var quizRoot: CategoryNode
        private set

    lateinit var referenceVocabRoot: CategoryNode
        private set

    lateinit var referenceTopics: List<ReferenceTopic>
        private set

    fun init(context: Context) {
        if (initialized) return
        allItems = loadVocab(context)
        quizRoot = buildTree("root", allItems.filter { it.categoryPath.firstOrNull() in QUIZ_ROOT_NAMES })
        referenceVocabRoot = buildTree("root", allItems.filter { it.categoryPath.firstOrNull() in REFERENCE_VOCAB_ROOT_NAMES })
        referenceTopics = loadReference(context)
        initialized = true
    }

    private fun loadVocab(context: Context): List<VocabItem> {
        val jsonText = context.assets.open("vocab.json").bufferedReader(Charsets.UTF_8).use { it.readText() }
        val arr = JSONArray(jsonText)
        val distractorsById = loadDistractors(context)
        val list = mutableListOf<VocabItem>()
        for (i in 0 until arr.length()) {
            val o = arr.getJSONObject(i)
            val pathArr = o.getJSONArray("category_path")
            val path = (0 until pathArr.length()).map { pathArr.getString(it) }
            val id = o.getInt("id")
            list.add(
                VocabItem(
                    id = id,
                    categoryPath = path,
                    japanese = o.getString("japanese"),
                    english = o.getString("english"),
                    pronunciation = o.optString("pronunciation", null).takeUnless { it.isNullOrEmpty() },
                    audioFile = o.optString("audio_file", null).takeUnless { it.isNullOrEmpty() },
                    distractors = distractorsById[id]
                )
            )
        }
        return list
    }

    // id -> 正解と紛らわしい不正解の選択肢(あらかじめAIが作成したもの)。ファイルがなければ空のまま。
    private fun loadDistractors(context: Context): Map<Int, List<String>> {
        return try {
            val jsonText = context.assets.open("distractors.json").bufferedReader(Charsets.UTF_8).use { it.readText() }
            val obj = JSONObject(jsonText)
            val map = mutableMapOf<Int, List<String>>()
            for (key in obj.keys()) {
                val arr = obj.getJSONArray(key)
                map[key.toInt()] = (0 until arr.length()).map { arr.getString(it) }
            }
            map
        } catch (e: java.io.IOException) {
            emptyMap()
        }
    }

    private fun buildTree(rootName: String, items: List<VocabItem>): CategoryNode {
        val root = CategoryNode(rootName, emptyList())
        for (item in items) {
            var node = root
            for (segment in item.categoryPath) {
                node = node.children.getOrPut(segment) { CategoryNode(segment, node.fullPath) }
            }
            node.items.add(item)
        }
        return root
    }

    fun search(query: String): List<VocabItem> {
        if (query.isBlank()) return emptyList()
        val q = query.trim().lowercase()
        return allItems.filter {
            it.japanese.lowercase().contains(q) || it.english.lowercase().contains(q)
        }
    }

    private fun loadReference(context: Context): List<ReferenceTopic> {
        val jsonText = context.assets.open("reference.json").bufferedReader(Charsets.UTF_8).use { it.readText() }
        val obj = JSONObject(jsonText)
        val topics = mutableListOf<ReferenceTopic>()
        for (key in obj.keys()) {
            val topicObj = obj.getJSONObject(key)
            val title = topicObj.getString("title")
            val sectionsArr = topicObj.getJSONArray("sections")
            val sections = mutableListOf<ReferenceSectionContent>()
            for (i in 0 until sectionsArr.length()) {
                val s = sectionsArr.getJSONObject(i)
                val bullets = s.optJSONArray("bullets")?.let { arr ->
                    (0 until arr.length()).map { arr.getString(it) }
                } ?: emptyList()
                val formulas = s.optJSONArray("formulas")?.let { arr ->
                    (0 until arr.length()).map { arr.getString(it) }
                } ?: emptyList()
                val table = s.optJSONObject("table")?.let { t ->
                    val headers = t.getJSONArray("headers").let { arr -> (0 until arr.length()).map { arr.getString(it) } }
                    val rowsArr = t.getJSONArray("rows")
                    val rows = (0 until rowsArr.length()).map { r ->
                        val rowArr = rowsArr.getJSONArray(r)
                        (0 until rowArr.length()).map { rowArr.getString(it) }
                    }
                    ReferenceTable(headers, rows)
                }
                sections.add(
                    ReferenceSectionContent(
                        title = s.getString("title"),
                        bullets = bullets,
                        formulas = formulas,
                        table = table,
                        note = s.optString("note", null).takeUnless { it.isNullOrEmpty() },
                        imageName = s.optString("image", null).takeUnless { it.isNullOrEmpty() }
                    )
                )
            }
            topics.add(ReferenceTopic(key, title, sections))
        }
        return topics
    }
}
