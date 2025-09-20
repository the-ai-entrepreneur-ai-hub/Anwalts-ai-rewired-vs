<template>
  <div>
    <!-- Header -->
    <header class="px-6 py-4 bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="icon-box">
            <svg class="w-5 h-5 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Rechtsdokument‑Assistent</h1>
            <p class="text-xs text-gray-500">Erstellen, prüfen und perfektionieren – mit konsistenten Kanzlei‑Bausteinen.</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <a href="/dashboard" class="btn-secondary text-sm" title="Zurück zum Dashboard">Zurück</a>
          <button id="btnHelp" class="toolbar-btn text-[color:var(--primary)]">Hilfe</button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-6">
      <!-- Stepper -->
      <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div class="card flex items-center gap-3 py-3">
          <div class="icon-box">
            <svg class="w-5 h-5 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115 7h1a3 3 0 010 6h-1"/></svg>
          </div>
          <div>
            <div class="text-sm font-medium">1. Dokument hochladen</div>
            <div class="text-xs text-gray-500">Optional</div>
          </div>
        </div>
        <div class="card flex items-center gap-3 py-3">
          <div class="icon-box">
            <svg class="w-5 h-5 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20l9-5-9-5-9 5 9 5z"/></svg>
          </div>
          <div>
            <div class="text-sm font-medium">2. Angaben & Vorgaben</div>
            <div class="text-xs text-gray-500">Pflichtfelder</div>
          </div>
        </div>
        <div class="card flex items-center gap-3 py-3">
          <div class="icon-box">
            <svg class="w-5 h-5 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/></svg>
          </div>
          <div>
            <div class="text-sm font-medium">3. Vorschau & Feinschliff</div>
            <div class="text-xs text-gray-500">Export bereit</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left -->
        <section class="space-y-4">
          <!-- Upload -->
          <div class="card" aria-label="Dokument hochladen">
            <div class="card-header">
              <div class="flex items-center gap-2">
                <div class="icon-box" aria-hidden="true"><svg class="w-5 h-5 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V4m0 0L8 8m4-4l4 4"/></svg></div>
                <h2 class="card-title">Dokument hochladen <span class="text-gray-400 text-sm">(optional)</span></h2>
              </div>
              <button class="btn-text text-sm" id="btnClearUpload">Zurücksetzen</button>
            </div>
            <div id="dropzone" class="dropzone">
              <div>
                <div class="mx-auto icon-box mb-2" aria-hidden="true"><svg class="w-5 h-5 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg></div>
                <p class="text-sm text-gray-700"><span class="text-[color:var(--primary)]">Datei hier ablegen</span> oder klicken</p>
                <p class="text-xs text-gray-500">PDF, DOC, DOCX, TXT</p>
              </div>
              <input id="fileInput" type="file" class="hidden" accept=".pdf,.doc,.docx,.txt" />
            </div>
            <div id="uploadInfo" class="hidden mt-3 text-sm text-gray-600"></div>
          </div>

          <!-- AI Instructions -->
          <div class="card" aria-label="KI‑Anweisungen">
            <div class="card-header">
              <div class="flex items-center gap-2">
                <div class="icon-box" aria-hidden="true"><svg class="w-5 h-5 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20l9-5-9-5-9 5 9 5z"/></svg></div>
                <h2 class="card-title">KI‑Anweisungen</h2>
              </div>
              <div class="flex items-center gap-3 text-xs text-gray-500">
                <label class="flex items-center gap-2">
                  <span>Juristische Sprache</span>
                  <span class="switch"><input id="switchLegalTone" type="checkbox" checked><span class="dot"></span></span>
                </label>
                <label class="flex items-center gap-2">
                  <span>Leichte Sprache</span>
                  <span class="switch"><input id="switchPlain" type="checkbox"><span class="dot"></span></span>
                </label>
              </div>
            </div>

            <label class="text-xs text-gray-500">Dokumenttyp</label>
            <input id="docType" class="input-field mt-1" placeholder="z. B. Mietvertrag, Abmahnung, Vergleich, NDA…" />

            <div class="mt-4">
              <div class="flex items-center justify-between">
                <label class="text-xs text-gray-500">Sachverhalt & Anforderungen</label>
                <button id="btnInsertChecklist" class="btn-text text-xs">Beispiel‑Checkliste einfügen</button>
              </div>
              <textarea id="requirements" class="input-field mt-1" rows="6" placeholder="Beschreiben Sie kurz den Fall. Nennen Sie Parteien, Ziele und besondere Bedingungen."></textarea>
              <p class="text-xs text-gray-400 mt-1" id="charCount">0 Zeichen</p>
            </div>

            <div class="mt-4">
              <label class="text-xs text-gray-500">Optionale Bausteine</label>
              <div class="mt-2 flex flex-wrap gap-2">
                <button class="chip" data-clause="Gerichtsstand">Gerichtsstand</button>
                <button class="chip" data-clause="Vertragsstrafe">Vertragsstrafe</button>
                <button class="chip" data-clause="Vertraulichkeit">Vertraulichkeit</button>
                <button class="chip" data-clause="Kündigung">Kündigung</button>
                <button class="chip" data-clause="Verjährung">Verjährung</button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600">Bereit, wenn Sie es sind. Sie können jederzeit neu generieren.</div>
              <div class="flex items-center gap-3">
                <button id="btnTemplates" class="btn-secondary text-sm">Vorlagen</button>
                <button id="btnClear" class="btn-secondary text-sm">Alle löschen</button>
                <button id="btnGenerate" class="btn-primary text-sm">Dokument erstellen ⏎</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Right -->
        <section>
          <div id="previewContainer" class="card" style="min-height: 540px;">
            <div class="card-header">
              <div class="flex items-center gap-2">
                <div class="icon-box" aria-hidden="true"><svg class="w-5 h-5 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 01-2 2z"/></svg></div>
                <h2 class="card-title">Dokument‑Vorschau</h2>
              </div>
              <div id="actionBar" class="flex items-center gap-2 text-sm flex-wrap hidden" style="display:none">
                <span id="wordCount" class="text-gray-500 mr-2">0 Wörter</span>
                <button class="toolbar-btn" id="btnCopy" title="In Zwischenablage kopieren">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M8 16h8a2 2 0 002-2v-2m-6 6H8a2 2 0 01-2-2v-2m10-6h2"/></svg>
                  Kopieren
                </button>
                <button class="toolbar-btn" id="btnEdit" title="Bearbeiten umschalten">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2m2 0h2m-8 0H7m0 0H5m2 0v2m0 2v2m0 2v2m0 2v2m2-2h2m2 0h2m2 0h2"/></svg>
                  Bearbeiten
                </button>
                <button class="toolbar-btn" id="btnSave" title="Speichern">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7"/></svg>
                  Speichern
                </button>
                <button class="toolbar-btn" id="btnApprove" title="Freigeben">
                  <svg class="w-4 h-4 inline mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Freigeben
                </button>
                <button class="toolbar-btn" id="btnReject" title="Ablehnen">
                  <svg class="w-4 h-4 inline mr-1 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  Ablehnen
                </button>
                <button class="toolbar-btn" id="btnAccept" title="Annehmen">
                  <svg class="w-4 h-4 inline mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/></svg>
                  Annehmen
                </button>
                <button class="toolbar-btn" id="btnExport" title="Als DOCX exportieren">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"/></svg>
                  DOCX
                </button>
                <button class="toolbar-btn" id="btnExportPdf" title="Als PDF exportieren">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0l-4-4m4 4l-4 4"/></svg>
                  PDF
                </button>
              </div>
            </div>

            <div id="previewArea" class="relative min-h-[420px]">
              <div id="previewEmpty" class="absolute inset-0 flex items-center justify-center text-center text-gray-500">
                <div>
                  <div class="mx-auto icon-box mb-3"><svg class="w-5 h-5 icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg></div>
                  <div class="font-medium text-gray-700">Noch kein Dokument erstellt</div>
                  <div class="text-xs">Laden Sie ein Dokument hoch oder geben Sie Anweisungen ein, um zu starten.</div>
                </div>
              </div>

              <div id="previewSkeleton" class="hidden space-y-3 p-4">
                <div class="skeleton h-6"></div>
                <div class="skeleton h-6 w-11/12"></div>
                <div class="skeleton h-6 w-10/12"></div>
                <div class="skeleton h-6 w-9/12"></div>
                <div class="skeleton h-6 w-8/12"></div>
              </div>

              <div id="genOverlay" class="hidden absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center rounded">
                <div class="w-16 h-16 rounded-full border-4 border-blue-200 border-t-[color:var(--primary)] animate-spin mb-3"></div>
                <div class="text-sm text-gray-700">Anwalts AI in Aktion …</div>
              </div>

              <article id="preview" class="prose max-w-none hidden p-4"></article>
            </div>
          </div>

          <div class="mt-3 text-xs text-gray-500">Tastatur: <kbd>Strg</kbd> + <kbd>Enter</kbd> generiert neu · <kbd>Alt</kbd> + <kbd>C</kbd> kopiert.</div>
        </section>
      </div>
    </main>

    <!-- Tour Elements -->
    <div id="tourOverlay" class="tour-overlay"></div>
    <div id="tourStep" class="tour-step hidden">
      <div class="tour-arrow"></div>
      <div id="tourContent" class="text-sm text-gray-800"></div>
      <div class="mt-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button id="tourPrev" class="btn-secondary text-sm">Zurück</button>
          <button id="tourNext" class="btn-primary text-sm">Weiter</button>
        </div>
        <button id="tourClose" class="text-sm text-gray-500">Schließen</button>
      </div>
      <button id="tourNever" class="mt-2 text-xs text-gray-500 underline">Nicht mehr zeigen</button>
    </div>

    <!-- Templates Modal (keeps original look) -->
    <div id="tplModal" class="modal">
      <div class="card w-[820px] max-h-[80vh] overflow-auto">
        <div class="card-header">
          <h3 class="card-title">Vorlagen auswählen</h3>
          <button class="toolbar-btn" id="tplClose">Schließen</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <input id="tplSearch" class="input-field" placeholder="Vorlagen durchsuchen… (z. B. NDA, Klage, Abmahnung)"/>
            <div id="tplGrid" class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3"></div>
          </div>
          <aside class="hidden md:block text-sm text-gray-600">
            <div class="text-xs text-gray-500">Tipps</div>
            <ul class="mt-2 list-disc pl-5">
              <li>Mit <em>Übernehmen</em> landet die Vorlage direkt in der Vorschau.</li>
              <li>Platzhalter wie [PARTEI A] später ersetzen.</li>
              <li>Ihre letzte Auswahl wird gespeichert.</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useHead } from '#imports'
import { useTour } from '#imports'

import { useDocumentAssistantStore } from '~/stores/document-assistant'
import { useAuthStore } from '~/stores/auth'
import { TemplatesService } from '~/services/templates-service'
import type { Template } from '~/types/template'

definePageMeta({ layout: false, middleware: ['auth-guard'] })

useHead({ title: 'Rechtsdokument-Assistent' })

const store = useDocumentAssistantStore()
const auth = useAuthStore()

const cleanupFns: Array<() => void> = []
const stopWatchers: Array<() => void> = []
let templateSearchTimer: ReturnType<typeof setTimeout> | null = null

function formatSize(bytes?: number | null): string {
  if (!bytes || Number.isNaN(bytes)) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

function currentCsrf() {
  return auth.csrfToken || undefined
}

function setUploadMessage(el: HTMLElement | null) {
  if (!el) return
  let message = ''
  if (store.upload.status === 'uploading') {
    message = `Lade hoch … ${store.upload.progress}%`
    if (store.upload.lastFile) {
      message += ` · ${store.upload.lastFile.name}`
    }
  } else if (store.upload.status === 'success' && store.upload.current) {
    const { filename, size } = store.upload.current
    message = `Hochgeladen: ${filename}`
    const formatted = formatSize(size)
    if (formatted) message += ` (${formatted})`
  } else if (store.upload.status === 'error' && store.upload.error) {
    message = store.upload.error
  }
  if (store.errors.banner && store.errors.banner !== message) {
    message = store.errors.banner
  }
  if (message) {
    el.textContent = message
    el.classList.remove('hidden')
  } else {
    el.textContent = ''
    el.classList.add('hidden')
  }
}

function updateClauseButtons(buttons: HTMLButtonElement[]) {
  const selected = new Set(store.configuration.selectedClauses)
  buttons.forEach((button) => {
    const clause = button.getAttribute('data-clause') || ''
    const isActive = selected.has(clause)
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false')
    if (isActive) {
      button.style.background = 'var(--primary)'
      button.style.color = '#fff'
      button.style.borderColor = 'var(--primary)'
    } else {
      button.style.background = '#fff'
      button.style.color = ''
      button.style.borderColor = '#e0e6ed'
    }
  })
}

function setPreviewVisibility(preview: HTMLElement | null, empty: HTMLElement | null, actionBar: HTMLElement | null) {
  const hasContent = store.preview.sanitizedHtml.trim().length > 0 && store.generation.status === 'success'
  if (hasContent) {
    preview?.classList.remove('hidden')
    if (preview) preview.style.display = ''
    empty?.classList.add('hidden')
    actionBar?.classList.remove('hidden')
    if (actionBar) actionBar.style.display = 'flex'
  } else {
    preview?.classList.add('hidden')
    if (preview) preview.style.display = 'none'
    empty?.classList.remove('hidden')
    actionBar?.classList.add('hidden')
    if (actionBar) actionBar.style.display = 'none'
  }
}

function attachKeyboardShortcuts(generateHandler: () => void, copyHandler: () => void, closeTemplates: () => void) {
  const handler = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'enter') {
      event.preventDefault()
      generateHandler()
    }
    if (event.altKey && event.key.toLowerCase() === 'c') {
      event.preventDefault()
      copyHandler()
    }
    if (event.key === 'Escape') {
      closeTemplates()
    }
  }
  document.addEventListener('keydown', handler)
  cleanupFns.push(() => document.removeEventListener('keydown', handler))
}

function renderTemplateCards(container: HTMLElement | null, templates: Template[], apply: (id: string) => void, preview: (id: string) => void) {
  if (!container) return
  container.innerHTML = ''
  templates.forEach((tpl) => {
    const card = document.createElement('div')
    card.className = 'p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col'
    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="font-medium text-gray-900">${tpl.name}</div>
          <div class="text-xs text-gray-500 line-clamp-3">${tpl.instructions || ''}</div>
        </div>
        <span class="inline-block px-2 py-1 rounded-full text-xs bg-[rgba(91,124,230,0.12)] text-[color:var(--primary)]">${tpl.category}</span>
      </div>
      <div class="mt-3 flex items-center gap-2">
        <button class="btn-primary px-3 py-2 rounded-md text-sm" data-apply="${tpl.id}">Übernehmen</button>
        <button class="btn-secondary px-3 py-2 rounded-md text-sm" data-preview="${tpl.id}">Vorschau</button>
      </div>`
    if (store.templates.selectedId === tpl.id) {
      card.classList.add('ring-2', 'ring-[color:var(--primary)]')
    }
    container.appendChild(card)
  })
  container.querySelectorAll<HTMLButtonElement>('[data-apply]').forEach((button) => {
    const id = button.getAttribute('data-apply') || ''
    const handler = () => apply(id)
    button.addEventListener('click', handler)
    cleanupFns.push(() => button.removeEventListener('click', handler))
  })
  container.querySelectorAll<HTMLButtonElement>('[data-preview]').forEach((button) => {
    const id = button.getAttribute('data-preview') || ''
    const handler = () => preview(id)
    button.addEventListener('click', handler)
    cleanupFns.push(() => button.removeEventListener('click', handler))
  })
}

onMounted(async () => {
  await auth.fetchStatus()
  store.hydrateTemplateSelection()

  const docsTour = useTour({ storageKey: 'docsTourDismissed' })
  docsTour.setSteps([
    { sel: '#docType', text: '<b>Dokumenttyp</b><br/>Wählen oder benennen Sie den gewünschten Dokumenttyp.' },
    { sel: '#requirements', text: '<b>Sachverhalt & Anforderungen</b><br/>Beschreiben Sie kurz den Fall und Vorgaben.' },
    { sel: '#btnGenerate', text: '<b>Generieren</b><br/>Erstellt einen ersten Entwurf basierend auf Ihren Angaben.' },
    { sel: '#previewContainer', text: '<b>Ergebnisbereich</b><br/>Hier erscheint das generierte Dokument mit Vorschau, Aktionen und Export.' },
  ])
  docsTour.attachDefaultHandlers()
  const helpHandler = () => docsTour.startTour()
  document.getElementById('btnHelp')?.addEventListener('click', helpHandler)
  cleanupFns.push(() => document.getElementById('btnHelp')?.removeEventListener('click', helpHandler))

  const dropzone = document.getElementById('dropzone') as HTMLElement | null
  const fileInput = document.getElementById('fileInput') as HTMLInputElement | null
  const uploadInfo = document.getElementById('uploadInfo') as HTMLElement | null
  const docTypeInput = document.getElementById('docType') as HTMLInputElement | null
  const requirementsTextarea = document.getElementById('requirements') as HTMLTextAreaElement | null
  const charCountEl = document.getElementById('charCount') as HTMLElement | null
  const switchLegal = document.getElementById('switchLegalTone') as HTMLInputElement | null
  const switchPlain = document.getElementById('switchPlain') as HTMLInputElement | null
  const templateButton = document.getElementById('btnTemplates') as HTMLButtonElement | null
  const clearButton = document.getElementById('btnClear') as HTMLButtonElement | null
  const generateButton = document.getElementById('btnGenerate') as HTMLButtonElement | null
  const clearUploadButton = document.getElementById('btnClearUpload') as HTMLButtonElement | null
  const copyButton = document.getElementById('btnCopy') as HTMLButtonElement | null
  const editButton = document.getElementById('btnEdit') as HTMLButtonElement | null
  const saveButton = document.getElementById('btnSave') as HTMLButtonElement | null
  const approveButton = document.getElementById('btnApprove') as HTMLButtonElement | null
  const rejectButton = document.getElementById('btnReject') as HTMLButtonElement | null
  const acceptButton = document.getElementById('btnAccept') as HTMLButtonElement | null
  const exportDocxButton = document.getElementById('btnExport') as HTMLButtonElement | null
  const exportPdfButton = document.getElementById('btnExportPdf') as HTMLButtonElement | null
  const previewEl = document.getElementById('preview') as HTMLElement | null
  const previewEmpty = document.getElementById('previewEmpty') as HTMLElement | null
  const previewSkeleton = document.getElementById('previewSkeleton') as HTMLElement | null
  const genOverlay = document.getElementById('genOverlay') as HTMLElement | null
  const actionBar = document.getElementById('actionBar') as HTMLElement | null
  const wordCountEl = document.getElementById('wordCount') as HTMLElement | null
  const clauseButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-clause]'))
  const tplModal = document.getElementById('tplModal') as HTMLElement | null
  const tplClose = document.getElementById('tplClose') as HTMLButtonElement | null
  const tplSearch = document.getElementById('tplSearch') as HTMLInputElement | null
  const tplGrid = document.getElementById('tplGrid') as HTMLElement | null

  const docTypeLabel = docTypeInput?.previousElementSibling as HTMLElement | null
  const requirementsLabel = requirementsTextarea?.previousElementSibling?.querySelector('label') as HTMLElement | null

  const openFileDialog = () => fileInput?.click()
  dropzone?.addEventListener('click', openFileDialog)
  cleanupFns.push(() => dropzone?.removeEventListener('click', openFileDialog))

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    dropzone?.classList.add('dragover')
  }
  const handleDragLeave = () => dropzone?.classList.remove('dragover')
  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    dropzone?.classList.remove('dragover')
    const file = event.dataTransfer?.files?.[0]
    if (file) {
      void store.uploadFile(file, { csrfToken: currentCsrf() })
    }
  }
  dropzone?.addEventListener('dragover', handleDragOver)
  dropzone?.addEventListener('dragleave', handleDragLeave)
  dropzone?.addEventListener('drop', handleDrop)
  cleanupFns.push(() => {
    dropzone?.removeEventListener('dragover', handleDragOver)
    dropzone?.removeEventListener('dragleave', handleDragLeave)
    dropzone?.removeEventListener('drop', handleDrop)
  })

  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      void store.uploadFile(file, { csrfToken: currentCsrf() })
    }
  }
  fileInput?.addEventListener('change', handleFileChange)
  cleanupFns.push(() => fileInput?.removeEventListener('change', handleFileChange))

  const handleDocTypeInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    store.setDocType(value)
  }
  docTypeInput?.addEventListener('input', handleDocTypeInput)
  cleanupFns.push(() => docTypeInput?.removeEventListener('input', handleDocTypeInput))

  const handleRequirementsInput = (event: Event) => {
    const value = (event.target as HTMLTextAreaElement).value
    store.setRequirements(value)
  }
  requirementsTextarea?.addEventListener('input', handleRequirementsInput)
  cleanupFns.push(() => requirementsTextarea?.removeEventListener('input', handleRequirementsInput))

  const handleChecklist = () => {
    const sample = '• Beteiligte Parteien (Namen, Adressen)\n• Wesentliche Bedingungen (z. B. Preis, Laufzeit)\n• Besondere Anforderungen (z. B. Geheimhaltung, Vertragsstrafe)\n• Fristen/Termine (konkretes Datum oder Zeitraum)'
    const currentValue = store.configuration.requirements
    if (!currentValue.includes('Beteiligte Parteien')) {
      const nextValue = currentValue ? `${currentValue}\n${sample}` : sample
      store.setRequirements(nextValue)
      if (requirementsTextarea) requirementsTextarea.value = nextValue
    }
  }
  document.getElementById('btnInsertChecklist')?.addEventListener('click', handleChecklist)
  cleanupFns.push(() => document.getElementById('btnInsertChecklist')?.removeEventListener('click', handleChecklist))

  const handleLegalToggle = () => store.toggleLegalTone()
  const handlePlainToggle = () => store.togglePlainLanguage()
  switchLegal?.addEventListener('change', handleLegalToggle)
  switchPlain?.addEventListener('change', handlePlainToggle)
  cleanupFns.push(() => {
    switchLegal?.removeEventListener('change', handleLegalToggle)
    switchPlain?.removeEventListener('change', handlePlainToggle)
  })

  clauseButtons.forEach((button) => {
    const clause = button.getAttribute('data-clause') || ''
    const handler = () => {
      store.toggleClause(clause)
    }
    button.addEventListener('click', handler)
    cleanupFns.push(() => button.removeEventListener('click', handler))
  })

  const handleGenerate = async () => {
    try {
      await store.generateDocument({ csrfToken: currentCsrf() })
    } catch (error) {
      console.error('Generierung fehlgeschlagen', error)
    }
  }

  const handleCopy = async () => {
    try {
      await store.copyPreview()
      if (copyButton) {
        const original = copyButton.textContent
        copyButton.textContent = 'Kopiert'
        setTimeout(() => { if (copyButton) copyButton.textContent = original || 'Kopieren' }, 1200)
      }
    } catch (error) {
      console.warn('Kopieren fehlgeschlagen', error)
    }
  }

  const handleTemplateClose = () => tplModal?.classList.remove('open')

  attachKeyboardShortcuts(handleGenerate, handleCopy, handleTemplateClose)

  generateButton?.addEventListener('click', handleGenerate)
  cleanupFns.push(() => generateButton?.removeEventListener('click', handleGenerate))

  const handleClear = () => {
    store.setDocType('')
    if (docTypeInput) docTypeInput.value = ''
    store.setRequirements('')
    if (requirementsTextarea) requirementsTextarea.value = ''
    store.configuration.selectedClauses = []
    store.configuration.templateId = null
    store.persistTemplateSelection(null)
    void store.resetUpload()
    setUploadMessage(uploadInfo)
  }
  clearButton?.addEventListener('click', handleClear)
  cleanupFns.push(() => clearButton?.removeEventListener('click', handleClear))

  const handleClearUpload = () => {
    void store.resetUpload()
    setUploadMessage(uploadInfo)
  }
  clearUploadButton?.addEventListener('click', handleClearUpload)
  cleanupFns.push(() => clearUploadButton?.removeEventListener('click', handleClearUpload))

  copyButton?.addEventListener('click', handleCopy)
  cleanupFns.push(() => copyButton?.removeEventListener('click', handleCopy))

  editButton?.addEventListener('click', () => {
    store.toggleEditing()
    if (editButton) {
      editButton.classList.toggle('ring-2', store.preview.isEditing)
      editButton.classList.toggle('ring-[color:var(--primary)]', store.preview.isEditing)
    }
  })
  cleanupFns.push(() => editButton?.removeEventListener('click', () => {}))

  saveButton?.addEventListener('click', async () => {
    try {
      await store.saveDocument({ csrfToken: currentCsrf() })
      if (saveButton) {
        const original = saveButton.textContent
        saveButton.textContent = 'Gespeichert'
        setTimeout(() => { if (saveButton && original) saveButton.textContent = original }, 1500)
      }
    } catch (error) {
      console.error('Speichern fehlgeschlagen', error)
    }
  })
  cleanupFns.push(() => saveButton?.removeEventListener('click', () => {}))

  const handleApprove = () => { void store.updateWorkflowStatus('approved', { csrfToken: currentCsrf() }) }
  const handleReject = () => { void store.updateWorkflowStatus('rejected', { csrfToken: currentCsrf() }) }
  const handleAccept = () => { void store.updateWorkflowStatus('accepted', { csrfToken: currentCsrf() }) }
  approveButton?.addEventListener('click', handleApprove)
  rejectButton?.addEventListener('click', handleReject)
  acceptButton?.addEventListener('click', handleAccept)
  cleanupFns.push(() => {
    approveButton?.removeEventListener('click', handleApprove)
    rejectButton?.removeEventListener('click', handleReject)
    acceptButton?.removeEventListener('click', handleAccept)
  })

  const handleExportDocx = async () => {
    try {
      const result = await store.exportDocument('docx', { csrfToken: currentCsrf() })
      const url = URL.createObjectURL(result.blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('DOCX-Export fehlgeschlagen', error)
    }
  }
  exportDocxButton?.addEventListener('click', handleExportDocx)
  cleanupFns.push(() => exportDocxButton?.removeEventListener('click', handleExportDocx))

  const handleExportPdf = async () => {
    try {
      const result = await store.exportDocument('pdf', { csrfToken: currentCsrf() })
      const url = URL.createObjectURL(result.blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF-Export fehlgeschlagen', error)
    }
  }
  exportPdfButton?.addEventListener('click', handleExportPdf)
  cleanupFns.push(() => exportPdfButton?.removeEventListener('click', handleExportPdf))

  const handleTemplateOpen = async () => {
    tplModal?.classList.add('open')
    setUploadMessage(uploadInfo)
    const response = await store.loadTemplates({ useCache: true })
    renderTemplateCards(tplGrid, response.templates, async (id) => {
      try {
        await store.applyTemplate(id, { csrfToken: currentCsrf() })
        if (docTypeInput) docTypeInput.value = store.configuration.docType
        if (requirementsTextarea) requirementsTextarea.value = store.configuration.requirements
        tplModal?.classList.remove('open')
      } catch (error) {
        console.error('Vorlage konnte nicht angewendet werden', error)
      }
    }, async (id) => {
      try {
        const previewData = await TemplatesService.previewTemplate(id)
        if (tplGrid) {
          tplGrid.querySelectorAll('[data-preview-content]')?.forEach((node) => node.remove())
        }
        const previewCard = document.createElement('div')
        previewCard.setAttribute('data-preview-content', 'true')
        previewCard.className = 'md:col-span-2 border border-gray-200 rounded-lg p-4 bg-white'
        previewCard.innerHTML = `<div class="text-sm text-gray-500">Template-Vorschau</div><div class="prose max-w-none mt-2">${previewData.previewContent}</div>`
        tplGrid?.prepend(previewCard)
      } catch (error) {
        console.error('Vorlage konnte nicht geladen werden', error)
      }
    })
  }
  templateButton?.addEventListener('click', handleTemplateOpen)
  cleanupFns.push(() => templateButton?.removeEventListener('click', handleTemplateOpen))

  tplClose?.addEventListener('click', handleTemplateClose)
  cleanupFns.push(() => tplClose?.removeEventListener('click', handleTemplateClose))

  const handleTemplateSearch = (event: Event) => {
    const term = (event.target as HTMLInputElement).value
    if (templateSearchTimer) clearTimeout(templateSearchTimer)
    templateSearchTimer = setTimeout(async () => {
      const response = await store.searchTemplates(term)
      renderTemplateCards(tplGrid, response.templates ?? store.templates.items, async (id) => {
        await store.applyTemplate(id, { csrfToken: currentCsrf() })
        if (docTypeInput) docTypeInput.value = store.configuration.docType
        if (requirementsTextarea) requirementsTextarea.value = store.configuration.requirements
        tplModal?.classList.remove('open')
      }, async (id) => {
        const previewData = await TemplatesService.previewTemplate(id)
        const previewCard = document.createElement('div')
        previewCard.className = 'md:col-span-2 border border-gray-200 rounded-lg p-4 bg-white'
        previewCard.innerHTML = `<div class="text-sm text-gray-500">Template-Vorschau</div><div class="prose max-w-none mt-2">${previewData.previewContent}</div>`
        tplGrid?.prepend(previewCard)
      })
    }, 300)
  }
  tplSearch?.addEventListener('input', handleTemplateSearch)
  cleanupFns.push(() => tplSearch?.removeEventListener('input', handleTemplateSearch))

  stopWatchers.push(watch(() => store.upload.status, () => setUploadMessage(uploadInfo)))
  stopWatchers.push(watch(() => store.upload.error, () => setUploadMessage(uploadInfo)))
  stopWatchers.push(watch(() => store.upload.progress, () => setUploadMessage(uploadInfo)))
  stopWatchers.push(watch(() => store.errors.banner, () => setUploadMessage(uploadInfo)))

  stopWatchers.push(watch(() => store.configuration.charCount, (count) => {
    if (charCountEl) {
      const message = store.fieldErrorMessage('requirements')
      charCountEl.textContent = message ? `${count} Zeichen · ${message}` : `${count} Zeichen`
    }
  }, { immediate: true }))

  stopWatchers.push(watch(() => store.configuration.docType, (value) => {
    if (docTypeInput && docTypeInput.value !== value) docTypeInput.value = value
    if (docTypeLabel) {
      const message = store.fieldErrorMessage('docType')
      docTypeLabel.textContent = message ? `Dokumenttyp · ${message}` : 'Dokumenttyp'
    }
  }, { immediate: true }))

  stopWatchers.push(watch(() => store.configuration.requirements, (value) => {
    if (requirementsTextarea && requirementsTextarea.value !== value) requirementsTextarea.value = value
    if (requirementsLabel) {
      const message = store.fieldErrorMessage('requirements')
      requirementsLabel.textContent = message ? `Sachverhalt & Anforderungen · ${message}` : 'Sachverhalt & Anforderungen'
    }
  }, { immediate: true }))

  stopWatchers.push(watch(() => [store.configuration.legalTone, store.configuration.plainLanguage], ([legal, plain]) => {
    if (switchLegal) switchLegal.checked = legal
    if (switchPlain) switchPlain.checked = plain
  }, { immediate: true }))

  stopWatchers.push(watch(() => store.configuration.selectedClauses.slice(), () => updateClauseButtons(clauseButtons), { immediate: true }))

  stopWatchers.push(watch(() => store.preview.sanitizedHtml, (html) => {
    if (previewEl) previewEl.innerHTML = html
    setPreviewVisibility(previewEl, previewEmpty, actionBar)
  }))

  stopWatchers.push(watch(() => store.preview.wordCount, (count) => {
    if (wordCountEl) wordCountEl.textContent = `${count} Wörter`
  }, { immediate: true }))

  stopWatchers.push(watch(() => store.preview.isEditing, (isEditing) => {
    if (previewEl) previewEl.setAttribute('contenteditable', isEditing ? 'true' : 'false')
  }, { immediate: true }))

  stopWatchers.push(watch(() => store.preview.html, (html) => {
    if (previewEl && store.preview.isEditing && previewEl.innerHTML !== html) {
      previewEl.innerHTML = html
    }
  }))

  stopWatchers.push(watch(() => store.generation.status, (status) => {
    const isLoading = status === 'loading'
    previewSkeleton?.classList.toggle('hidden', !isLoading)
    genOverlay?.classList.toggle('hidden', !isLoading)
    if (docTypeInput) docTypeInput.disabled = isLoading
    if (requirementsTextarea) requirementsTextarea.disabled = isLoading
    clauseButtons.forEach((btn) => { btn.disabled = isLoading })
    if (switchLegal) switchLegal.disabled = isLoading
    if (switchPlain) switchPlain.disabled = isLoading
    setPreviewVisibility(previewEl, previewEmpty, actionBar)
  }, { immediate: true }))

  stopWatchers.push(watch(() => store.workflow.status, (status) => {
    if (approveButton) approveButton.disabled = status === 'approved' || status === 'accepted'
    if (acceptButton) acceptButton.disabled = status !== 'approved'
    if (rejectButton) rejectButton.disabled = status === 'rejected'
  }, { immediate: true }))

  if (previewEl) {
    const editableHandler = (event: Event) => {
      if (store.preview.isEditing) {
        store.updatePreviewContent((event.target as HTMLElement).innerHTML)
      }
    }
    previewEl.addEventListener('input', editableHandler)
    cleanupFns.push(() => previewEl.removeEventListener('input', editableHandler))
  }

  setUploadMessage(uploadInfo)
  setPreviewVisibility(previewEl, previewEmpty, actionBar)
})

onBeforeUnmount(() => {
  cleanupFns.splice(0).forEach((fn) => {
    try { fn() } catch (error) { console.error('cleanup failed', error) }
  })
  stopWatchers.splice(0).forEach((stop) => {
    try { stop() } catch (error) { console.error('watcher stop failed', error) }
  })
  if (templateSearchTimer) clearTimeout(templateSearchTimer)
})

  function renderTemplates(list){
    const grid = document.getElementById('tplGrid')
    if (!grid) return
    grid.innerHTML = ''
    list.forEach(t => {
      const card = document.createElement('div')
      card.className = 'p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col'
      card.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="font-medium text-gray-900">${t.title}</div>
            <div class="text-xs text-gray-500">${t.prompt}</div>
          </div>
          <span class="inline-block px-2 py-1 rounded-full text-xs bg-[rgba(91,124,230,0.12)] text-[color:var(--primary)]">${t.category}</span>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <button class="btn-primary px-3 py-2 rounded-md text-sm" data-apply="${t.id}">Übernehmen</button>
          <button class="btn-secondary px-3 py-2 rounded-md text-sm" data-preview="${t.id}">Vorschau</button>
        </div>`
      grid.appendChild(card)
    })

    grid.querySelectorAll('[data-apply]').forEach(btn => btn.addEventListener('click', (e)=>{
      const id = e.currentTarget.getAttribute('data-apply')
      const tpl = TEMPLATE_STORE.find(x=>x.id===id)
      applyTemplate(tpl)
      try{ localStorage.setItem('anwalt.templateId', id) }catch(_){ }
      document.getElementById('tplModal')?.classList.remove('open')
    }))

    grid.querySelectorAll('[data-preview]').forEach(btn => btn.addEventListener('click', (e)=>{
      const id = e.currentTarget.getAttribute('data-preview')
      const tpl = TEMPLATE_STORE.find(x=>x.id===id)
      quickPreview(tpl)
    }))
  }

  function quickPreview(){ /* disabled: templates should not render into preview */ }

  function setPreview(text){
    const preview = document.getElementById('preview')
    const wordCount = document.getElementById('wordCount')
    if (!preview) return
    preview.innerHTML = text.split('\n').join('<br/>')
    const trimmed = preview.innerText.trim()
    const wc = trimmed ? trimmed.split(/[ \t\r\n]+/).filter(Boolean).length : 0
    if (wordCount) wordCount.textContent = wc + ' Wörter'
  }

  function applyTemplate(tpl){
    SELECTED_TEMPLATE = tpl
    const docType = document.getElementById('docType')
    const req = document.getElementById('requirements')
    if (docType) docType.value = tpl.docType
    if (req) {
      req.value = `• Bitte Platzhalter ersetzen: [ … ]\n• ${tpl.prompt}`
      req.dispatchEvent(new Event('input'))
    }
    // Do not preview template content automatically; only AI results should render
    const actionBar = document.getElementById('actionBar'); actionBar?.classList.add('hidden')
  }

  function loadLastTemplate(){
    try{ localStorage.removeItem('anwalt.templateId') }catch(_){ }
  }

  // Upload interactions
  const dz = document.getElementById('dropzone')
  const fileInput = document.getElementById('fileInput')
  const uploadInfo = document.getElementById('uploadInfo')
  dz?.addEventListener('click', () => fileInput?.click())
  dz?.addEventListener('dragover', (e)=>{ e.preventDefault(); dz.classList.add('dragover') })
  dz?.addEventListener('dragleave', ()=> dz.classList.remove('dragover'))
  dz?.addEventListener('drop', (e)=>{ e.preventDefault(); dz.classList.remove('dragover'); if(e.dataTransfer.files && e.dataTransfer.files.length){ fileInput.files = e.dataTransfer.files; handleFile(fileInput.files[0]) }})
  fileInput?.addEventListener('change', (e)=>{ const f = e.target.files[0]; if (f) handleFile(f) })
  document.getElementById('btnClearUpload')?.addEventListener('click', ()=>{ if (fileInput) fileInput.value=''; uploadInfo?.classList.add('hidden'); if (uploadInfo) uploadInfo.textContent='' })

  async function handleFile(file){
    if (!uploadInfo) return
    uploadInfo.textContent = 'Lade hoch … ' + file.name
    uploadInfo.classList.remove('hidden')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(proxyUploadUrl, { method: 'POST', body: form, credentials: 'include' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const label = data?.filename || data?.name || file.name
      uploadInfo.textContent = `Hochgeladen: ${label}`
      window.__lastUploadId = data?.id || data?.fileId || data?.file_id
    } catch (e) {
      uploadInfo.textContent = `Upload fehlgeschlagen: ${String(e)}`
    }
  }

  // Character counter & helpers
  const req = document.getElementById('requirements')
  const charCount = document.getElementById('charCount')
  req?.addEventListener('input', ()=>{ if (charCount) charCount.textContent = req.value.length + ' Zeichen' })

  document.getElementById('btnInsertChecklist')?.addEventListener('click', ()=>{
    const sample = '• Beteiligte Parteien (Namen, Adressen)\n• Wesentliche Bedingungen (z. B. Preis, Laufzeit)\n• Besondere Anforderungen (z. B. Geheimhaltung, Vertragsstrafe)\n• Fristen/Termine (konkretes Datum oder Zeitraum)'
    if (req && req.value.indexOf('Beteiligte Parteien') === -1) req.value = (req.value ? req.value + '\n' : '') + sample
    req?.dispatchEvent(new Event('input'))
  })

  const clauseButtons = $$('[data-clause]')
  if (Array.isArray(clauseButtons)) clauseButtons.forEach(btn=> btn.addEventListener('click', ()=>{
    if (!req) return
    const txt = btn.getAttribute('data-clause')
    req.value += '\n• Klausel: ' + txt
    req.dispatchEvent(new Event('input'))
  }))

  // Help tour via shared composable (documents)
  const docsTour = useTour({ storageKey: 'docsTourDismissed' })
  docsTour.setSteps([
    { sel: '#docType', text: '<b>Dokumenttyp</b><br/>Wählen oder benennen Sie den gewünschten Dokumenttyp.' },
    { sel: '#requirements', text: '<b>Sachverhalt & Anforderungen</b><br/>Beschreiben Sie kurz den Fall und Vorgaben.' },
    { sel: '#btnGenerate', text: '<b>Generieren</b><br/>Erstellt einen ersten Entwurf basierend auf Ihren Angaben.' },
    { sel: '#previewContainer', text: '<b>Ergebnisbereich</b><br/>Hier erscheint das generierte Dokument mit Vorschau, Aktionen und Export.' }
  ])
  docsTour.attachDefaultHandlers()
  document.getElementById('btnHelp')?.addEventListener('click', () => docsTour.startTour())
  document.addEventListener('click', (ev) => {
    const t = ev.target instanceof Element ? ev.target.closest('#btnHelp') : null
    if (!t) return
    ev.preventDefault?.()
    docsTour.startTour()
  }, { capture: true })

  // Auto-start disabled, use Help button

  // Try load templates from backend
  ;(async () => {
    try {
      if (!ep.templates) return
      const res = await fetch(ep.templates, { credentials: 'include', headers: { ...getAuthHeader() } })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length) {
          TEMPLATE_STORE = data.map(t => ({
            id: t.id || t.key || t.slug,
            title: t.name || t.title,
            category: t.category || t.type || 'Allgemein',
            docType: t.type === 'document' ? (t.name || 'Rechtsdokument') : 'Rechtsdokument',
            prompt: t.description || '',
            body: t.content || ''
          }))
        }
      }
    } catch (_) {}
  })()

  // Templates modal
  const tplModal = document.getElementById('tplModal')
  document.getElementById('btnTemplates')?.addEventListener('click', ()=> {
    tplModal?.classList.add('open')
    renderTemplates(TEMPLATE_STORE)
    const inp = document.getElementById('tplSearch'); if (inp) inp.value=''
  })
  document.getElementById('tplClose')?.addEventListener('click', ()=> tplModal?.classList.remove('open'))
  document.getElementById('tplSearch')?.addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase()
    const filtered = TEMPLATE_STORE.filter(t => (t.title + ' ' + t.category + ' ' + t.prompt).toLowerCase().includes(q))
    renderTemplates(filtered)
  })

  // Generate
  const preview = document.getElementById('preview')
  const previewEmpty = document.getElementById('previewEmpty')
  const previewSkeleton = document.getElementById('previewSkeleton')
  const wordCount = document.getElementById('wordCount')

  async function generate(){
    // Render generation state inside the preview area only
    previewEmpty?.classList.add('hidden')
    preview?.classList.add('hidden')
    const overlay = document.getElementById('genOverlay')
    overlay?.classList.remove('hidden')
    const actionBar = document.getElementById('actionBar')
    actionBar?.classList.add('hidden')
    let contentSet = false

    const type = document.getElementById('docType')?.value || (SELECTED_TEMPLATE?.docType || 'Rechtsdokument')
    const instr = req?.value.trim() || ''
    const toneLegal = document.getElementById('switchLegalTone')?.checked
    const plain = document.getElementById('switchPlain')?.checked

    try {
      // Try generate endpoint fallbacks via SSR proxy (converts cookies to Authorization)
      const candidates = [
        apiEndpoints.generateSimple || (apiBase ? `${apiBase}/ai/generate-document-simple` : ''),
        apiEndpoints.generate || (apiBase ? `${apiBase}/ai/generate-document` : '')
      ].filter(Boolean)

      let payload = null
      let saw403 = false
      for (const url of candidates) {
        try {
          const isSimple = url.includes('generate-document-simple')
          const reqBody = isSimple
            ? {
                title: type,
                document_type: type,
                instructions: instr,
                tone: toneLegal ? (plain ? 'legal+plain' : 'legal') : (plain ? 'plain' : 'neutral'),
                template_content: SELECTED_TEMPLATE?.body || '',
                template_id: SELECTED_TEMPLATE?.id || null,
                variables: {},
                model: null,
                uploadId: (window).__lastUploadId || null
              }
            : {
                // Strict schema for /api/ai/generate-document
                title: type,
                document_type: type,
                template_content: SELECTED_TEMPLATE?.body || '',
                variables: {},
                template_id: SELECTED_TEMPLATE?.id || null,
                model: null
              }

          const res = await proxyPost(url, reqBody)
          if (res.status === 403) { saw403 = true; continue }
          if (res.ok) { payload = await res.json(); break }
        } catch (_) { /* try next */ }
      }
      if (!payload) throw new Error('Generate endpoint not configured')
      const doc = payload?.document || payload
      const bodyHtml = doc?.content || doc?.html || doc?.contentHtml || (doc?.text ? `<p>${doc.text.replace(/\n/g,'<br/>')}</p>` : '')
      if (bodyHtml) {
        const styleNote = toneLegal ? (plain ? 'Juristisch präzise – zugleich gut lesbar.' : 'Juristisch präzise Formulierung.') : (plain ? 'Leicht verständliche Formulierung.' : 'Neutraler Stil.')
        const header = `<h2 style=\"margin:0\">${type}</h2><hr/><p><em>${styleNote}</em></p>`
        const withInstr = instr ? `<h3>Vorgaben</h3><p>${instr.replace(/\n/g,'<br/>')}</p>` : ''
        setPreview(header + bodyHtml + withInstr)
        contentSet = true
        actionBar?.classList.remove('hidden'); if (actionBar) actionBar.style.display = 'flex'
      }
    } catch (e) {
      console.error('Generate failed:', e)
      if (saw403) alert('Nicht autorisiert (403). Bitte erneut anmelden oder Token prüfen.')
    } finally {
      if (contentSet) {
        preview?.classList.remove('hidden'); if (preview) preview.style.display = ''
        previewEmpty?.classList.add('hidden')
      } else {
        preview?.classList.add('hidden'); if (preview) preview.style.display = 'none'
        previewEmpty?.classList.remove('hidden')
        actionBar?.classList.add('hidden'); if (actionBar) actionBar.style.display = 'none'
      }
      overlay?.classList.add('hidden')
      const trimmed = preview?.innerText.trim()
      const wc = trimmed ? trimmed.split(/[ \t\r\n]+/).filter(Boolean).length : 0
      if (wordCount) wordCount.textContent = wc + ' Wörter'
    }
  }

  const genBtn = document.getElementById('btnGenerate')
  if (genBtn) genBtn.addEventListener('click', generate)
  document.addEventListener('keydown', (e)=>{ if ((e.ctrlKey||e.metaKey) && e.key==='Enter') { generate() } })

  // Copy / Export (demo)
  const copyBtn = document.getElementById('btnCopy')
  if (copyBtn) copyBtn.addEventListener('click', async ()=>{
    if (!preview) return
    const tmp = document.createElement('div'); tmp.innerHTML = preview.innerHTML; const text = tmp.innerText; await navigator.clipboard.writeText(text); alert('In Zwischenablage kopiert')
  })
  const exportBtn = document.getElementById('btnExport')
  if (exportBtn) exportBtn.addEventListener('click', async ()=>{
    if (!preview) return alert('Nichts zu exportieren')
    try {
      if (!ep.save) throw new Error('Save endpoint not configured')
      const savePath = (apiEndpoints.save || (apiBase ? `${apiBase}/documents/save` : ''))
      const res = await proxyPost(savePath, {
        title: document.getElementById('docType')?.value || 'Rechtsdokument',
        html: preview.innerHTML,
        uploadedFileId: window.__lastUploadId || null
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const saved = await res.json()
      const id = saved?.id || saved?.documentId
      window.__lastDocId = id
      if (id) {
        const exportBase = apiEndpoints.exportBase || (apiBase ? `${apiBase}/documents` : '')
        const url = `${exportBase}/${id}/export?format=docx`
        const resp = await proxyGet(url)
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const blob = await resp.blob()
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = (document.getElementById('docType')?.value || 'Dokument') + '.docx'
        document.body.appendChild(a); a.click(); a.remove()
      } else {
        alert('Gespeichert, aber keine ID erhalten.')
      }
    } catch (e) {
      alert('Export fehlgeschlagen: ' + String(e))
    }
  })

  // PDF export button
  const exportPdfBtn = document.getElementById('btnExportPdf')
  if (exportPdfBtn) exportPdfBtn.addEventListener('click', async ()=>{
    if (!preview) return alert('Nichts zu exportieren')
    try {
      if (!ep.save) throw new Error('Save endpoint not configured')
      const savePath = (apiEndpoints.save || (apiBase ? `${apiBase}/documents/save` : ''))
      const res = await proxyPost(savePath, { title: document.getElementById('docType')?.value || 'Rechtsdokument', html: preview.innerHTML })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const saved = await res.json(); const id = saved?.id || saved?.documentId
      window.__lastDocId = id
      const exportBase = apiEndpoints.exportBase || (apiBase ? `${apiBase}/documents` : '')
      if (id && exportBase) {
        const url = `${exportBase}/${id}/export?format=pdf`
        const resp = await proxyGet(url)
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const blob = await resp.blob()
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = (document.getElementById('docType')?.value || 'Dokument') + '.pdf'
        document.body.appendChild(a); a.click(); a.remove()
      }
    } catch (e) { alert('Export fehlgeschlagen: ' + String(e)) }
  })

  // Edit/Save/Approve/Reject/Accept actions
  const editBtn = document.getElementById('btnEdit')
  const saveBtn = document.getElementById('btnSave')
  const approveBtn = document.getElementById('btnApprove')
  const rejectBtn = document.getElementById('btnReject')
  const acceptBtn = document.getElementById('btnAccept')

  if (editBtn) editBtn.addEventListener('click', ()=>{
    if (!preview) return
    const editable = preview.getAttribute('contenteditable') === 'true'
    preview.setAttribute('contenteditable', editable ? 'false' : 'true')
    preview.classList.toggle('ring-2')
    preview.classList.toggle('ring-blue-400')
  })

  if (saveBtn) saveBtn.addEventListener('click', async ()=>{
    if (!preview) return
    try {
      if (!ep.save) throw new Error('Save endpoint not configured')
      const res = await fetch(ep.save, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, credentials: 'include',
        body: JSON.stringify({ title: document.getElementById('docType')?.value || 'Rechtsdokument', html: preview.innerHTML })
      })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      const saved = await res.json(); window.__lastDocId = saved?.id || saved?.documentId; alert('Gespeichert')
    } catch (e) { alert('Speichern fehlgeschlagen: ' + String(e)) }
  })

  async function setStatus(status){
    try {
      if (!((apiEndpoints.status || (apiBase ? `${apiBase}/documents/status` : '')) || (apiEndpoints.exportBase || (apiBase ? `${apiBase}/documents` : '')))) throw new Error('Status endpoint not configured')
      const did = (window).__lastDocId
      let url = (apiEndpoints.status || (apiBase ? `${apiBase}/documents/status` : ''))
      if (!url && did) {
        const exportBase = apiEndpoints.exportBase || (apiBase ? `${apiBase}/documents` : '')
        if (exportBase) url = `${exportBase}/${did}/status`
      }
      const res = await proxyPost(url, { status, doc_id: did || null })
      if (!res.ok) throw new Error('HTTP ' + res.status)
      alert('Status: ' + status)
    } catch (e) { alert('Status Änderung fehlgeschlagen: ' + String(e)) }
  }
  if (approveBtn) approveBtn.addEventListener('click', ()=> setStatus('approved'))
  if (rejectBtn) rejectBtn.addEventListener('click', ()=> setStatus('rejected'))
  if (acceptBtn) acceptBtn.addEventListener('click', ()=> setStatus('accepted'))

  // Clear
  const clearBtn = document.getElementById('btnClear')
  if (clearBtn) clearBtn.addEventListener('click', ()=>{
    const docType = document.getElementById('docType'); if (docType) docType.value=''
    if (req) { req.value=''; req.dispatchEvent(new Event('input')) }
    setPreview(''); preview?.classList.add('hidden'); previewEmpty?.classList.remove('hidden')
    SELECTED_TEMPLATE=null; try{ localStorage.removeItem('anwalt.templateId') }catch(_){ }
    const actionBar = document.getElementById('actionBar'); actionBar?.classList.add('hidden')
  })

  // Boot: render template cards, but do NOT auto-load any previous template
  renderTemplates(TEMPLATE_STORE)

  // Enforce clean initial state: no preview or action bar until AI generates
  try {
    const preview = document.getElementById('preview')
    const previewEmpty = document.getElementById('previewEmpty')
    const actionBar = document.getElementById('actionBar')
    if (preview) preview.innerHTML = ''
    preview?.classList.add('hidden')
    previewEmpty?.classList.remove('hidden')
    actionBar?.classList.add('hidden')
  } catch (_) {}
})
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --primary: #5b7ce6;
  --primary-hover: #4a6cd4;
  --icon-bg: rgba(91,124,230,0.12);
  --bg: #f8f9fa;
  --text: #2c3e50;
  --muted: #e8ecf3;
  --muted-hover: #d8dfe9;
}

body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }

.card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.06); }
.card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px; }
.card-title { font-weight: 600; color:#0f172a; }

.btn-primary { background: var(--primary); color:#fff; padding:10px 16px; border-radius: 10px; font-weight:500; }
.btn-primary:hover { background: var(--primary-hover); }
.btn-secondary { background: var(--muted); color: var(--text); padding:10px 16px; border-radius: 10px; font-weight:500; }
.btn-secondary:hover { background: var(--muted-hover); }
.btn-text { color: var(--primary); }

.input-field { width: 100%; padding: 12px 14px; border: 1px solid #e0e6ed; border-radius: 10px; background: #fff; transition: border-color 0.2s; font-size:14px; }
.input-field:focus { outline:none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(91,124,230,0.15); }

.icon { border: 0; }
.icon-box { background: var(--icon-bg); color: var(--primary); border-radius: 10px; width: 36px; height: 36px; display:flex; align-items:center; justify-content:center; }

.dropzone { border: 1.5px dashed #cbd5e1; border-radius: 12px; background: #f8fafc; min-height: 140px; display:flex; align-items:center; justify-content:center; text-align:center; }
.dropzone.dragover { border-color: var(--primary); background: #f1f5ff; }

.skeleton { position: relative; overflow: hidden; background: #eef1f6; border-radius: 8px; }
.skeleton::after { content:""; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); animation: shimmer 1.2s infinite; }
@keyframes shimmer { 100% { transform: translateX(100%); } }

.toolbar-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border:1px solid #e5e7eb; border-radius:8px; color:#374151; background:#fff; transition: all .15s ease-in-out; }
.toolbar-btn:hover { background:#f9fafb; border-color:#d1d5db }
.toolbar-btn:active { transform: translateY(0.5px) }
.toolbar-btn:focus-visible { outline: 2px solid rgba(59,130,246,0.5); outline-offset: 2px }

.chip { border: 1px solid #e0e6ed; background: white; padding: 6px 10px; border-radius: 9999px; font-size: 12px; }

.switch { position: relative; width: 40px; height: 22px; background: #e5e7eb; border-radius: 9999px; transition: background .2s; }
.switch input { display:none; }
.switch .dot { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: transform .2s; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.switch input:checked + .dot { transform: translateX(18px); }

.modal { position: fixed; inset: 0; display:none; align-items:center; justify-content:center; background: rgba(17,24,39,0.55); z-index: 50; }
.modal:not(.open) { pointer-events: none; }
.modal.open { display:flex; }

/* Spinner */
.spinner {
  width: 18px; height: 18px; border-radius: 9999px; border: 2px solid #cbd5e1; border-top-color: var(--primary); animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Tour (match dashboard behavior) */
.tour-overlay { position: fixed; inset: 0; background: rgba(17,24,39,0.55); z-index: 9998; display: none; pointer-events: none; }
.tour-step { position: absolute; background: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); padding: 16px; width: 320px; z-index: 9999; }
.tour-arrow { width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #fff; position: absolute; top: -8px; left: 24px; }
.tour-focus { outline: 3px solid var(--primary); outline-offset: 2px; border-radius: 6px; transition: outline-color .2s; }
</style>
