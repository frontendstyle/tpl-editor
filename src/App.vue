<template>
  <tpl-editor ref="editorRef" v-model="html" @add="showAddDialog" @edit="showEditDialog" max-length="200"/>
    <div v-if="show">
        <div>
            <label>模版内容</label>
            <input type="text" v-model="form.text">
        </div>
        <div v-if="form.type === 'link'">
            <label>链接URL</label>
            <input type="text" v-model="form.url">
        </div>
        <div>
            <button @click="handleAddTag({...form})">save</button>
        </div>
    </div>
  <div v-html="html"></div>
  <div>{{template}}</div>
</template>

<script setup>
import {computed, reactive, ref} from "vue";
const editorRef = ref(null)
const show = ref(false)
const html = ref('')
const form = reactive({
  id: '',
  type: '',
  text: '',
  url: ''
})

const showAddDialog = (type) => {
  show.value = true
  form.type = type
}

const showEditDialog = (id, text, url) => {
  show.value = true
  form.id = id
  form.type = url ? 'link' : 'tag'
  form.text = text
  form.url = url
}

const handleAddTag = (form) => {
  editorRef.value.appendChild(form)
  show.value = false
}

const tagReplaceReg = /(<placeholder[\w\W]*?>)([\w\W]*?)(<\/placeholder>)/gi
const getTemplateText = html => {
  return html ? html.replace(tagReplaceReg, '{{$2}}') : ''
}

const template = computed(function() {
  return getTemplateText(html.value)
})

</script>
