package com.eigogakushu.app.data

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONObject

private const val HALL_OF_FAME_THRESHOLD = 3

object WrongAnswerStore {
    private const val PREFS_NAME = "wrong_answers"
    private const val KEY_COUNTS = "counts_json"

    private lateinit var prefs: SharedPreferences
    private val counts = mutableMapOf<Int, Int>()

    fun init(context: Context) {
        if (::prefs.isInitialized) return
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val json = prefs.getString(KEY_COUNTS, null)
        if (json != null) {
            val obj = JSONObject(json)
            for (key in obj.keys()) {
                counts[key.toInt()] = obj.getInt(key)
            }
        }
    }

    private fun persist() {
        val obj = JSONObject()
        for ((id, count) in counts) {
            obj.put(id.toString(), count)
        }
        prefs.edit().putString(KEY_COUNTS, obj.toString()).apply()
    }

    fun recordWrong(id: Int) {
        counts[id] = (counts[id] ?: 0) + 1
        persist()
    }

    fun clearItem(id: Int) {
        if (counts.remove(id) != null) {
            persist()
        }
    }

    fun getWrongCount(id: Int): Int = counts[id] ?: 0

    fun reviewIds(): List<Int> = counts.filter { it.value in 1 until HALL_OF_FAME_THRESHOLD }.keys.toList()

    fun hallOfFameIds(): List<Int> = counts.filter { it.value >= HALL_OF_FAME_THRESHOLD }.keys.toList()

    fun reviewItems(): List<VocabItem> {
        val ids = reviewIds().toSet()
        return VocabRepository.allItems.filter { it.id in ids }
    }

    fun hallOfFameItems(): List<VocabItem> {
        val ids = hallOfFameIds().toSet()
        return VocabRepository.allItems.filter { it.id in ids }
    }
}
