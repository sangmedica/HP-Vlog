package com.eigogakushu.app.data

data class VocabItem(
    val id: Int,
    val categoryPath: List<String>,
    val japanese: String,
    val english: String,
    val pronunciation: String?,
    val audioFile: String?,
    val distractors: List<String>? = null
)

class CategoryNode(val name: String, val parentPath: List<String>) {
    val fullPath: List<String> = parentPath + name
    val children: LinkedHashMap<String, CategoryNode> = LinkedHashMap()
    val items: MutableList<VocabItem> = mutableListOf()

    fun allItemsRecursive(): List<VocabItem> {
        val result = mutableListOf<VocabItem>()
        result.addAll(items)
        for (child in children.values) {
            result.addAll(child.allItemsRecursive())
        }
        return result
    }

    fun itemCountRecursive(): Int = allItemsRecursive().size
}

data class ReferenceSection(val title: String, val bullets: List<String>, val note: String?)
data class ReferenceTable(val headers: List<String>, val rows: List<List<String>>)
data class ReferenceTopic(
    val key: String,
    val title: String,
    val sections: List<ReferenceSectionContent>
)

data class ReferenceSectionContent(
    val title: String,
    val bullets: List<String>,
    val formulas: List<String>,
    val table: ReferenceTable?,
    val note: String?,
    val imageName: String?
)
