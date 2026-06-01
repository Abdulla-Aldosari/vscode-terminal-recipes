const vscode = acquireVsCodeApi();

// ===== SVG Icon Helpers =====
function iconRun() {
  return `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 4v16l13 -8l-13 -8" /></svg>`;
}
function iconUse() { // lucide-arrow-down-to-line
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 7l5 5l-5 5" /><path d="M13 17l6 0" /></svg>`;
}
function iconCopy() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666" /><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" /></svg>`;
}
function iconEdit() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.5" d="m14.36 4.079l.927-.927a3.932 3.932 0 0 1 5.561 5.561l-.927.927m-5.56-5.561s.115 1.97 1.853 3.707C17.952 9.524 19.92 9.64 19.92 9.64m-5.56-5.561l-8.522 8.52c-.577.578-.866.867-1.114 1.185a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.094 3.281m17.6-10.162L11.4 18.16c-.577.577-.866.866-1.184 1.114a6.6 6.6 0 0 1-1.211.749c-.364.173-.751.302-1.526.56l-3.281 1.094m0 0l-.802.268a1.06 1.06 0 0 1-1.342-1.342l.268-.802m1.876 1.876l-1.876-1.876"/></svg>`;
}
function iconDelete() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M9.17 4a3.001 3.001 0 0 1 5.66 0m5.67 2h-17m15.333 2.5l-.46 6.9c-.177 2.654-.265 3.981-1.13 4.79s-2.196.81-4.856.81h-.774c-2.66 0-3.991 0-4.856-.81c-.865-.809-.954-2.136-1.13-4.79l-.46-6.9M9.5 11l.5 5m4.5-5l-.5 5"/></svg>`;
}
function iconSparkles() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M13 7a9.3 9.3 0 0 0 1.516 -.546c.911 -.438 1.494 -1.015 1.937 -1.932c.207 -.428 .382 -.928 .547 -1.522c.165 .595 .34 1.095 .547 1.521c.443 .918 1.026 1.495 1.937 1.933c.426 .205 .925 .38 1.516 .546a9.3 9.3 0 0 0 -1.516 .547c-.911 .438 -1.494 1.015 -1.937 1.932a9 9 0 0 0 -.547 1.521c-.165 -.594 -.34 -1.095 -.547 -1.521c-.443 -.918 -1.026 -1.494 -1.937 -1.932a9 9 0 0 0 -1.516 -.547" /><path d="M3 14a21 21 0 0 0 1.652 -.532c2.542 -.953 3.853 -2.238 4.816 -4.806a20 20 0 0 0 .532 -1.662a20 20 0 0 0 .532 1.662c.963 2.567 2.275 3.853 4.816 4.806q .75 .28 1.652 .532a21 21 0 0 0 -1.652 .532c-2.542 .953 -3.854 2.238 -4.816 4.806a20 20 0 0 0 -.532 1.662a20 20 0 0 0 -.532 -1.662c-.963 -2.568 -2.275 -3.853 -4.816 -4.806a21 21 0 0 0 -1.652 -.532" /></svg>`;
}
function iconAISettings() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M11.992 21c-.728 -.003 -1.455 -.442 -1.667 -1.317a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c.882 .214 1.32 .95 1.317 1.684" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M19 22.5a4.75 4.75 0 0 1 3.5 -3.5a4.75 4.75 0 0 1 -3.5 -3.5a4.75 4.75 0 0 1 -3.5 3.5a4.75 4.75 0 0 1 3.5 3.5" /></svg>`;
}
function iconSettings() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>`;
}
function iconAdjustmentsSettings() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 6l8 0" /><path d="M16 6l4 0" /><path d="M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 12l2 0" /><path d="M10 12l10 0" /><path d="M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M4 18l11 0" /><path d="M19 18l1 0" /></svg>`;
}
function iconKey() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z"/><path d="m14 7 3 3"/><path d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814"/></svg>`;
}
function iconExternalLink() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;
}
function iconAiSetupHelp() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 16v.01" /><path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" /><path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969" /><path d="M14 3.223a9.003 9.003 0 0 1 0 17.554" /><path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592" /><path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305" /><path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356" /></svg>`;
}

function iconCheckboxOk() { // ✅
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 11l3 3l8 -8" /><path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" /></svg>`;
}
function iconSort() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>`;
}
function iconDragHandle() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>`;
}
function iconHeart() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`;
}
function iconHeartActive() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`;
}
function iconHeartPlus() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.479 19.374-.971.939a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.219 1.49"/><path d="M15 15h6"/><path d="M18 12v6"/></svg>`;
}
function iconHeartMinus() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14.876 18.99-1.368 1.323a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.244 1.572"/><path d="M15 15h6"/></svg>`;
}

function iconCommand() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>`;
}
function iconGroup() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"/><path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z"/><path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z"/><path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"/></svg>`;
}
function iconRecent() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`;
}
function iconAdd() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;
}
function iconVariables() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.828 14.828 21 21"/><path d="M21 16v5h-5"/><path d="m21 3-9 9-4-4-6 6"/><path d="M21 8V3h-5"/></svg>`;
}


function iconExclamationTriangle() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
}

function IconCircleCheck() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>`;
}

function IconCircleX() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M10 10l4 4m0 -4l-4 4" /></svg>`;
}

function IconCircleExclamation() { // ✅
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 9v4" /><path d="M12 16v.01" /></svg>`;
}




// SVG: chevron down (For custom dropdown menues) - using for indicating expandable dropdown arrows
const chevronSvg = `<svg viewBox="0 0 21 21" width="17" height="17" class="cs-chevron" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m6 9l6 6l6-6"></path></svg>`;

// SVG: checkmark (For custom dropdown menues) - using for selected menu items
const checkmarkSvg = `<svg viewBox="0 0 24 24" width="17" height="17" class="cs-check" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 6L9 17l-5-5"></path></svg>`;

const columnSvg = `<svg viewBox="0 0 21 21" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6h2" /><path d="M4 10h5.5" /><path d="M4 14h5.5" /><path d="M4 18h5.5" /><path d="M14.5 6h5.5" /><path d="M14.5 10h5.5" /><path d="M18 14h2" /><path d="M14.5 18h3.5" /><path d="M3 3l18 18" /></svg>`;



const uiState = {
  activeTab: (function () {
    try {
      const SAVED_TABS = ['recent', 'favorites', 'manage', 'commands', 'variables'];
      const saved = localStorage.getItem('selectedTab');
      return saved && SAVED_TABS.includes(saved) ? saved : 'recent';
    } catch {return 'recent';}
  }()),
  noticeMessage: '',
  noticeIcon: '',
  noticeType: '',
  selectedCategoryId: (function () {
    try {
      return localStorage.getItem('selectedCategoryId') || '';
    } catch {return '';}
  }()),
  selectedGroupId: 'all',
  sortingMode: false,
  editingCommandId: null,
  editSourceTab: null,
  pendingScrollCommandId: null,
  commandDrafts: {},
  commandRemember: {},
  editCommandDraft: {
    title: '',
    template: '',
    description: '',
    groupId: '',
    helpUrl: '',
    variableMeta: {},
    targetCategoryId: '',
  },
  newCommandDraft: {
    visible: false,
    title: '',
    template: '',
    description: '',
    groupId: '',
    helpUrl: '',
    variableMeta: {},
  },
  columnVisibility: (function () {
    try {
      const saved = localStorage.getItem('columnVisibility');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          description: parsed.description !== undefined ? parsed.description : true,
          groups: parsed.groups !== undefined ? parsed.groups : true,
        };
      }
    } catch { }
    return {description: true, groups: true};
  }()),
  // 'local' = workspace favorites, 'global' = global favorites
  favoritesScope: (function () {
    try {return localStorage.getItem('favoritesScope') || 'local';} catch {return 'local';}
  }()),
};

let noticeTimer = null;
let noticeIsError = false;
let runConfirmState = {
  commandId: null,
  resolvedCommand: '',
  selectedShellPath: null,
  selectedShellName: null,
};

let variableInputState = {
  commandId: null,
  action: null,
  missingVariables: [],
  inputValues: {},
  rememberFlags: {},
  returnToRunConfirm: false,
};

let deleteConfirmState = {
  type: null,
  id: null,
  title: '',
  template: '',
};

let manageModalState = {
  visible: false,
  mode: null, // 'add-category' | 'rename-category' | 'add-group' | 'rename-group'
  value: '',
};

// Enum Manager Modal state
let enumManagerState = {
  visible: false,
  commandId: null,     // null = new command context, string = editing existing command
  varName: '',
  enumValues: [],      // working copy array of {title, value, description}
  editIndex: null,     // index of item being edited inline, or null
  editTitle: '',
  editValue: '',
  editDescription: '',
};

// Favorites Unified Modal state
// selectedLocal / selectedGlobal = tag selections (pre-filled based on current state)
let favoriteModalState = {
  visible: false,
  commandId: null,
  selectedLocal: false,
  selectedGlobal: false,
};

// Unfavorite Confirm Modal (normal click on iconHeartMinus in Favorites tab)
let unfavoriteConfirmState = {
  visible: false,
  commandId: null,
  scope: null, // 'local' | 'global'
};

// AI feature state
let aiState = {
  view: null,          // null | 'settings' | 'prompt' | 'loading' | 'results'
  mode: null,          // 'full' | 'single'
  prompt: '',
  result: null,        // AI result object from extension
  categoryId: '',      // for single mode: pre-selected category
  groupId: '',         // for single mode: pre-selected group
  checkedIds: {},      // { [commandId]: boolean }
  filterGroupId: 'all',
  providerName: 'gemini', // Initial configuration fallback value, actual providerName will be set from 'extension.js' on aiSettingsResult postMessage
  keyStatus: {},
  settingsProviderName: 'gemini',  // Initial configuration fallback value
  apiKeyInput: '',
  error: '',
  // Provider setup metadata received from extension (ai/providers-config.js)
  aiProviderSetup: null,
};

// AI Provider Setup modal state
let aiProviderSetupModalState = {
  visible: false,
  providerName: null,  // 'gemini' | 'openai' | 'anthropic' | ...
};

const state = {
  data: {
    version: 1,
    categories: [],
    commands: [],
  },
  globalCommandsFile: '',
  workspaceFolder: null,
  commandVariables: {
    version: 2,
    commands: {},
  },
  globalCommandVariables: {
    version: 2,
    commands: {},
  },
  terminalProfiles: {
    defaultProfile: '',
    profiles: [],
  },
  autoVariables: [],
  autoVariablesSettings: {},
  globalFavorites: [],
  localFavorites: [],
};

window.addEventListener('message', function (event) {
  const message = event.data;

  if (!message || typeof message.type !== 'string') {
    return;
  }

  if (message.type === 'state') {
    hydrateState(message.payload);
    ensureSelectionDefaults();
    render();
    return;
  }

  if (message.type === 'saveResult') {
    if (message.payload && message.payload.success) {
      showNotice('Saved successfully.', IconCircleCheck(), 'success');
    } else {
      showNotice(`Save failed: ${message.payload && message.payload.message ? message.payload.message : 'Unknown error'}`, IconCircleX(), 'error');
    }
    // Page is already rendered by persistDataThenRender() — just update the notice element
    paintNotice();
    return;
  }

  if (message.type === 'actionResult') {
    if (message.payload && message.payload.success) {
      showNotice(`Action "${message.payload.action}" completed.`, IconCircleCheck(), 'info');

      if (message.payload.commandVariables && typeof message.payload.commandVariables === 'object') {
        state.commandVariables = message.payload.commandVariables;
      }

      if (message.payload.globalCommandVariables && typeof message.payload.globalCommandVariables === 'object') {
        state.globalCommandVariables = message.payload.globalCommandVariables;
      }
    } else {
      showNotice(`Action failed: ${message.payload && message.payload.message ? message.payload.message : 'Unknown error'}`, IconCircleX(), 'error');
    }

    render();
    return;
  }

  if (message.type === 'saveVariablesResult') {
    if (message.payload && message.payload.success) {
      if (message.payload.commandVariables) {
        state.commandVariables = message.payload.commandVariables;
      }

      if (message.payload.globalCommandVariables) {
        state.globalCommandVariables = message.payload.globalCommandVariables;
      }
    }
    // No render() here to avoid focus loss while editing
  }

  if (message.type === 'aiSettingsResult') {
    if (message.payload) {
      aiState.providerName = message.payload.providerName || 'gemini';
      aiState.settingsProviderName = message.payload.providerName || 'gemini';
      aiState.keyStatus = message.payload.keyStatus || {};
      // Store provider setup data from providers-config.js (sent by extension)
      if (message.payload.aiProviderSetup && typeof message.payload.aiProviderSetup === 'object') {
        aiState.aiProviderSetup = message.payload.aiProviderSetup;
      }
    }
    render();
    return;
  }

  if (message.type === 'aiSaveSettingsResult') {
    if (message.payload && message.payload.success) {
      // Re-fetch settings to refresh keyStatus
      vscode.postMessage({type: 'aiGetSettings'});
      showNotice('AI settings saved.', IconCircleCheck(), 'success');
    } else {
      showNotice(`Failed to save settings: ${message.payload && message.payload.message ? message.payload.message : 'Unknown error'}`, IconCircleX(), 'error');
      render();
    }
    return;
  }

  if (message.type === 'aiGenerateResult') {
    if (message.payload && message.payload.success) {
      aiState.result = message.payload.result;
      aiState.mode = message.payload.mode;
      // Initialize all commands as checked
      const cmds = message.payload.mode === 'full'
        ? (message.payload.result.commands || [])
        : [message.payload.result];
      const checked = {};
      cmds.forEach(function (cmd) {checked[cmd.id] = true;});
      aiState.checkedIds = checked;
      aiState.filterGroupId = 'all';
      aiState.error = '';
      aiState.view = 'results';
    } else {
      aiState.error = message.payload && message.payload.message ? message.payload.message : 'Unknown error';
      aiState.view = 'prompt';
    }
    render();
    return;
  }

  if (message.type === 'aiInsertResult') {
    if (message.payload && message.payload.success) {
      aiState.view = null;
      aiState.result = null;
      aiState.prompt = '';
      aiState.error = '';
      showNotice(`Inserted ${message.payload.count} command(s) successfully.`, IconCircleCheck(), 'success');
    } else {
      aiState.error = message.payload && message.payload.message ? message.payload.message : 'Unknown error';
      aiState.view = 'results';
    }
    render();
    return;
  }

  if (message.type === 'saveAutoVariablesSettingsResult') {
    if (message.payload && message.payload.success) {
      showNotice('Auto variables settings saved.', IconCircleCheck(), 'success');
    } else {
      showNotice('Failed to save: ' + (message.payload && message.payload.message ? message.payload.message : 'Unknown error'), IconCircleX(), 'error');
    }
    // Page is already rendered — just insert the notice element directly
    paintNotice();
    return;
  }

  if (message.type === 'saveFavoritesResult') {
    if (message.payload && message.payload.success) {
      if (Array.isArray(message.payload.globalFavorites)) {
        state.globalFavorites = message.payload.globalFavorites;
      }
      if (Array.isArray(message.payload.localFavorites)) {
        state.localFavorites = message.payload.localFavorites;
      }
    }
    render();
    return;
  }
});

function hydrateState(payload) {
  state.data = payload && payload.data ? payload.data : state.data;
  state.globalCommandsFile = payload && payload.globalCommandsFile ? payload.globalCommandsFile : '';
  state.workspaceFolder = payload ? payload.workspaceFolder : null;
  state.commandVariables = payload && payload.commandVariables ? payload.commandVariables : {version: 2, commands: {}};
  state.globalCommandVariables = payload && payload.globalCommandVariables ? payload.globalCommandVariables : {version: 2, commands: {}};
  state.terminalProfiles = payload && payload.terminalProfiles ? payload.terminalProfiles : {defaultProfile: '', profiles: []};
  state.autoVariables = payload && Array.isArray(payload.autoVariables) ? payload.autoVariables : [];
  state.autoVariablesSettings = payload && payload.autoVariablesSettings ? payload.autoVariablesSettings : {};
  state.globalFavorites = payload && Array.isArray(payload.globalFavorites) ? payload.globalFavorites : [];
  state.localFavorites = payload && Array.isArray(payload.localFavorites) ? payload.localFavorites : [];

  // If no workspace, force scope to 'global'
  if (!state.workspaceFolder && uiState.favoritesScope === 'local') {
    uiState.favoritesScope = 'global';
  }

  // Initialize selected shell from default profile if not already set
  if (runConfirmState.selectedShellName == null) {
    const profiles = state.terminalProfiles.profiles || [];
    const defaultName = state.terminalProfiles.defaultProfile || '';
    const defaultProfileEntry = profiles.find(function (p) {return p.name === defaultName;}) || profiles[0] || null;
    runConfirmState.selectedShellName = defaultProfileEntry ? defaultProfileEntry.name : null;
    runConfirmState.selectedShellPath = defaultProfileEntry ? defaultProfileEntry.shellPath : null;
  }

  const localCmds = state.commandVariables.commands || {};
  const globalCmds = state.globalCommandVariables.commands || {};
  const allCommandIds = new Set([...Object.keys(localCmds), ...Object.keys(globalCmds)]);

  allCommandIds.forEach(function (commandId) {
    if (!uiState.commandDrafts[commandId]) {
      const globalVars = globalCmds[commandId] || {};
      const localVars = localCmds[commandId] || {};
      uiState.commandDrafts[commandId] = {...globalVars, ...localVars};
    }

    if (!uiState.commandRemember[commandId]) {
      const remembered = {};
      const globalVars = globalCmds[commandId] || {};
      const localVars = localCmds[commandId] || {};
      Object.keys(globalVars).forEach(function (key) {
        remembered[key] = 'global';
      });
      Object.keys(localVars).forEach(function (key) {
        remembered[key] = 'local';
      });
      uiState.commandRemember[commandId] = remembered;
    }
  });
}

function ensureSelectionDefaults() {
  const categories = state.data.categories || [];

  if (!categories.length) {
    uiState.selectedCategoryId = '';
    uiState.selectedGroupId = 'all';
    return;
  }

  if (!categories.some(function (category) {
    return category.id === uiState.selectedCategoryId;
  })) {
    uiState.selectedCategoryId = categories[0].id;
  }

  const groups = getSelectedCategoryGroups();

  if (uiState.selectedGroupId !== 'all' && !groups.some(function (group) {
    return group.id === uiState.selectedGroupId;
  })) {
    uiState.selectedGroupId = 'all';
  }
}

function setSelectedCategory(categoryId) {
  uiState.selectedCategoryId = categoryId;
  try {
    localStorage.setItem('selectedCategoryId', categoryId);
  } catch { }
}

function getSelectedCategory() {
  return (state.data.categories || []).find(function (category) {
    return category.id === uiState.selectedCategoryId;
  }) || null;
}

function getSelectedCategoryGroups() {
  const category = getSelectedCategory();
  return category ? category.groups || [] : [];
}

function getVisibleCommands() {
  return (state.data.commands || []).filter(function (command) {
    if (command.categoryId !== uiState.selectedCategoryId) {
      return false;
    }

    if (uiState.selectedGroupId === 'all') {
      return true;
    }

    return command.groupId === uiState.selectedGroupId;
  });
}

function getEditingCommand() {
  if (!uiState.editingCommandId) {
    return null;
  }

  return (state.data.commands || []).find(function (command) {
    return command.id === uiState.editingCommandId;
  }) || null;
}

function render() {
  ensureSelectionDefaults();

  const app = document.getElementById('app');
  const selectedCategory = getSelectedCategory();

  app.innerHTML = `
    <div class="layout">
      <header class="header">
        <h1>Terminal Recipes</h1>
        <div class="header-actions">
          <button id="btn-open-local-variables-file" class="btn small secondary" ${state.workspaceFolder ? '' : 'disabled'} data-tooltip="${state.workspaceFolder ? 'Open local variables JSON file' : 'No workspace open'}">Open Local Variables JSON</button>
          <button id="btn-open-global-variables-file" class="btn small secondary" data-tooltip="Open global variables JSON file">Open Global Variables JSON</button>
          <button id="btn-open-commands-file" class="btn small secondary" data-tooltip="Open global commands JSON file">Open Global JSON</button>
          <button id="btn-ai-settings" class="btn small secondary ai-settings-btn" data-tooltip="AI Settings">${iconAISettings()} AI Settings</button>
        </div>
      </header>
      <p class="workspace-label">Workspace: <code>${escapeHtml(state.workspaceFolder || 'No workspace open')}</code></p>


      ${uiState.noticeMessage ? `<div class="notice${uiState.noticeType ? ' notice-' + uiState.noticeType : ''}"><div class="notice-icon">${uiState.noticeIcon}</div><div class="notice-message">${uiState.noticeMessage}</div></div>` : ''}

      <section class="card tabs-section">
        <div class="tabs">
          <button class="tab ${!uiState.editingCommandId && uiState.activeTab === 'recent' ? 'active' : ''}" data-tab="recent">${iconRecent()} Recent Commands</button>
          <button class="tab ${!uiState.editingCommandId && uiState.activeTab === 'favorites' ? 'active' : ''}" data-tab="favorites">${iconHeart()} Favorites</button>
          <button class="tab ${!uiState.editingCommandId && uiState.activeTab === 'manage' ? 'active' : ''}" data-tab="manage">${iconGroup()} Categories & Groups</button>
          <button class="tab ${!uiState.editingCommandId && uiState.activeTab === 'commands' ? 'active' : ''}" data-tab="commands">${iconCommand()} Commands</button>
          <button class="tab tab-push-right ${!uiState.editingCommandId && uiState.activeTab === 'add' ? 'active' : ''}" data-tab="add" ${selectedCategory ? '' : 'disabled'}>${iconAdd()} Add New Command</button>
          <button class="tab ${!uiState.editingCommandId && uiState.activeTab === 'variables' ? 'active' : ''}" data-tab="variables">${iconVariables()} Variables</button>
        </div>
      </section>

      ${uiState.editingCommandId ? renderEditTab() : (
      uiState.activeTab === 'recent' ? renderRecentCommandsTab() :
        uiState.activeTab === 'favorites' ? renderFavoritesTab() :
          uiState.activeTab === 'manage' ? renderManageTab() :
            uiState.activeTab === 'commands' ? renderCommandsTab(selectedCategory) :
              uiState.activeTab === 'add' ? renderAddCommandTab(selectedCategory) :
                uiState.activeTab === 'variables' ? renderVariablesTab() : ''
    )}
      ${renderVariableInputModal()}
      ${renderRunConfirmModal()}
      ${renderDeleteConfirmModal()}
      ${favoriteModalState.visible ? renderFavoriteModal() : ''}
      ${unfavoriteConfirmState.visible ? renderUnfavoriteConfirmModal() : ''}
      ${aiState.view === 'settings' ? renderAiSettingsModal() : ''}
      ${aiState.view === 'prompt' ? renderAiPromptModal() : ''}
      ${aiState.view === 'loading' ? renderAiLoadingOverlay() : ''}
      ${aiState.view === 'results' ? renderAiResultsModal() : ''}
      ${aiProviderSetupModalState.visible ? renderAiProviderSetupModal() : ''}
      ${enumManagerState.visible ? renderEnumManagerModal() : ''}
    </div>
  `;

  bindEvents();
  // Auto-resize template textareas and initialize syntax highlight overlay
  document.querySelectorAll('.template-textarea').forEach(function (el) {
    autoResizeTextarea(el);
    updateTemplateHighlight(el);
    el.addEventListener('scroll', function () {
      var h = el.previousElementSibling;
      if (h && h.classList.contains('template-highlight')) {
        h.scrollTop = el.scrollTop;
      }
    });
  });
  bindAiEvents();
  bindCmdTitleLinks();
  if (enumManagerState.visible) {
    bindEnumManagerEvents();
  }

  // Scroll & highlight a pending row (set before render() was called)
  if (uiState.pendingScrollCommandId) {
    var _pendingId = uiState.pendingScrollCommandId;
    uiState.pendingScrollCommandId = null;
    setTimeout(function () {scrollToAndHighlight(_pendingId);}, 30);
  }
}

function renderManageTab() {
  const categories = state.data.categories || [];
  const selectedCategory = getSelectedCategory();
  const selectedGroups = getSelectedCategoryGroups();

  return `
    <section class="card manage-card">
      <div class="manage-layout">

        <!-- Categories Panel -->
        <div class="manage-panel">
          <div class="manage-panel-header">
            <h2 class="manage-panel-title">Categories</h2>
            <div class="row">
              <button class="btn small secondary ai-create-btn" id="btn-create-with-ai" data-tooltip="Generate a full category with groups and commands using AI">${iconSparkles()} Create with AI</button>
              <button class="btn primary small" id="btn-open-add-category-modal" data-tooltip="Add a new category">+ Add New Category</button>
            </div>
          </div>
          <div class="manage-list">
            ${categories.length === 0 ? `<p class="muted manage-empty">No categories yet.</p>` : ''}
            ${categories.map(function (category) {
    const isActive = category.id === uiState.selectedCategoryId;
    return `
              <div class="manage-item ${isActive ? 'active' : ''}" data-category-id="${escapeAttr(category.id)}">
                <div class="manage-item-info">
                  <span class="manage-item-label">${escapeHtml(category.title)}</span>
                  <code class="manage-item-count">${(state.data.commands || []).filter(function (c) {return c.categoryId === category.id;}).length}</code>
                </div>
                <div class="manage-item-actions">
                  <button class="btn small secondary btn-rename-category" data-category-id="${escapeAttr(category.id)}" data-category-title="${escapeAttr(category.title)}" data-tooltip="Rename category">Rename</button>
                  <button class="btn small danger btn-delete-category" data-category-id="${escapeAttr(category.id)}" data-category-title="${escapeAttr(category.title)}" data-tooltip="Delete category and all its commands">Delete</button>
                </div>
              </div>
            `;
  }).join('')}
          </div>
        </div>

        <!-- Groups Panel -->
        <div class="manage-panel">
          <div class="manage-panel-header">
            <h2 class="manage-panel-title">Groups</h2>
            <button class="btn small primary" id="btn-open-add-group-modal" ${selectedCategory ? '' : 'disabled'} data-tooltip="${selectedCategory ? 'Add a new group to this category' : 'Select a category first'}">+ Add New Group</button>
          </div>
          <div class="manage-list">
            ${!selectedCategory ? `<p class="muted manage-empty">Select a category first.</p>` : ''}
            ${selectedCategory && selectedGroups.length === 0 ? `<p class="muted manage-empty">No groups yet.</p>` : ''}
            ${selectedGroups.map(function (group) {
    const isActive = group.id === uiState.selectedGroupId;
    return `
              <div class="manage-item ${isActive ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">
                <div class="manage-item-info">
                  <span class="manage-item-label">${escapeHtml(group.title)}</span>
                  <code class="manage-item-count">${(state.data.commands || []).filter(function (c) {return c.categoryId === uiState.selectedCategoryId && c.groupId === group.id;}).length}</code>
                </div>
                <div class="manage-item-actions">
                  <button class="btn small secondary btn-rename-group" data-group-id="${escapeAttr(group.id)}" data-group-title="${escapeAttr(group.title)}" data-tooltip="Rename group">Rename</button>
                  <button class="btn small danger btn-delete-group" data-group-id="${escapeAttr(group.id)}" data-group-title="${escapeAttr(group.title)}" data-tooltip="Delete group">Delete</button>
                </div>
              </div>
            `;
  }).join('')}
          </div>
        </div>

      </div>
    </section>
    ${renderManageModal()}
  `;
}

function renderManageModal() {
  if (!manageModalState.visible) {
    return '';
  }

  const mode = manageModalState.mode;
  let title = '';
  let placeholder = '';
  let btnLabel = '';

  if (mode === 'add-category') {
    title = 'Add New Category';
    placeholder = 'Category name...';
    btnLabel = 'Add';
  } else if (mode === 'rename-category') {
    title = 'Rename Category';
    placeholder = 'New name...';
    btnLabel = 'Rename';
  } else if (mode === 'add-group') {
    title = 'Add New Group';
    placeholder = 'Group name...';
    btnLabel = 'Add';
  } else if (mode === 'rename-group') {
    title = 'Rename Group';
    placeholder = 'New name...';
    btnLabel = 'Rename';
  }

  return `
    <div class="modal-overlay" id="manage-modal-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box">
        <h3>${escapeHtml(title)}</h3>
        <input id="manage-modal-input" class="input" placeholder="${escapeAttr(placeholder)}" value="${escapeAttr(manageModalState.value)}" autocomplete="off" />
        <div class="row justify-content-flex-end">
          <button class="btn primary min-w65" id="btn-manage-modal-confirm">${escapeHtml(btnLabel)}</button>
          <button class="btn secondary action min-w65" id="btn-manage-modal-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderCommandsTab(selectedCategory) {
  // Show edit form inline when editing
  if (uiState.editingCommandId) {
    return renderEditTab();
  }

  const groups = getSelectedCategoryGroups();
  const commands = getVisibleCommands();

  if (!selectedCategory) {
    return `
      <section class="card">
        <p>Add a category first in Categories &amp; Groups tab.</p>
      </section>
    `;
  }

  return `
    <section class="card">
      
      <div class="row align-items-center commands-toolbar">
        <h2 class="pb-5">Commands Browser</h2>
        <div class="${uiState.sortingMode ? 'sort-disabled-wrap' : ''}">
          ${renderCustomCategorySelect()}
        </div>
        <div class="${uiState.sortingMode ? 'sort-disabled-wrap' : ''}">
          ${renderColumnToggleDropdown()}
        </div>
        <button class="btn small secondary ai-create-btn" id="btn-add-with-ai" data-tooltip="${uiState.selectedGroupId === 'all' ? 'Select a specific group first' : 'Generate a command using AI'}" ${uiState.selectedGroupId === 'all' || uiState.sortingMode ? 'disabled' : ''}>${iconSparkles()} Add with AI</button>
        <button class="btn small secondary ${uiState.sortingMode ? 'sort-btn-active' : ''}" id="btn-toggle-sort" data-tooltip="${uiState.sortingMode ? 'Click to exit sort mode' : 'Drag to reorder commands'}">${iconSort()} ${uiState.sortingMode ? 'Done Sorting' : 'Sort'}</button>
      </div>
      <div class="group-tags-row ${uiState.sortingMode ? 'sort-disabled-wrap' : ''}">
        <span class="groups-label">Groups:</span>
        <button class="tag group-filter-tag ${uiState.selectedGroupId === 'all' ? 'active' : ''}" data-group-id="all">All</button>
        ${groups.map(function (group) {
    return `<button class="tag group-filter-tag ${uiState.selectedGroupId === group.id ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
  }).join('')}
      </div>
      <div class="table-panel">
        ${renderCommandsTable(commands, groups)}
      </div>
    </section>
  `;
}

function renderAddCommandTab(selectedCategory) {
  if (!selectedCategory) {
    return `
      <section class="card">
        <p>Add a category first in Categories &amp; Groups tab.</p>
      </section>
    `;
  }

  const groups = getSelectedCategoryGroups();
  const draft = uiState.newCommandDraft;
  const autoVarNames = getEnabledAutoVariableNames();
  const detectedVars = draft.template ? collectVariables([draft.template]).filter(function (n) {return !autoVarNames.includes(n);}) : [];
  const newCommandDraft = getCommandDraft('__new__');
  const newCommandRemember = getCommandRemember('__new__');

  return `
    <section class="card">
      <h2>Add Command to ( ${escapeHtml(selectedCategory.title)} )</h2>
      <form id="form-new-command" class="form-grid add-command-grid">
        <label class="add-command-title">Command Title<input id="new-command-title" class="input" required value="${escapeAttr(draft.title)}" /></label>
        <label class="add-command-template">Command Template (Variables supported)<div class="template-editor-wrap"><div class="template-highlight" aria-hidden="true"></div>
        <textarea id="new-command-template" class="input template-textarea" required placeholder="npm install \${package_name}" rows="1">${escapeHtml(draft.template)}</textarea></div>
        <div class="template-var-legend">

        <span class="legend-item legend-auto hidden" data-tooltip="Reserved variables that are automatically resolved.<br>
        They do not require the user to assign a value."><span class="legend-dot" aria-hidden="true"></span>auto resolved</span>

        <span class="legend-item legend-user hidden" data-tooltip="Variables that are defined by the user.<br>
        Their values must be set by the user."><span class="legend-dot" aria-hidden="true"></span>user defined</span></div>
        </label>
        <label class="full-width">Description<textarea id="new-command-description" class="input" rows="2">${escapeAttr(draft.description)}</textarea></label>
        <div class="full-width grouped-tags-wrap">
          <span class="groups-label">Groups:</span>
          <div class="inline-tags" id="new-command-groups-tags">
            ${groups.map(function (group) {
    return `<button type="button" class="tag new-command-group-tag ${draft.groupId === group.id ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
  }).join('')}
          </div>
        </div>
        <label class="full-width">Help URL (optional)<input id="new-command-help-url" class="input" placeholder="https://docs.example.com/command" value="${escapeAttr(draft.helpUrl || '')}" /></label>
        ${detectedVars.length ? `
        <div class="full-width mt-5">
          <h3>Command Variables:</h3>
          <div class="variables-list">
            <div class="variable-row">
              <span></span>
              <span></span>
              <span class="muted vars-store-location" data-tooltip="Local = saved per workspace only<br>Global = saved across all workspaces<br>Off = not saved">Variables store location</span>
              <span></span>
            </div>
            ${detectedVars.map(function (name) {
    const value = newCommandDraft[name] || '';
    const rememberValue = newCommandRemember[name] || 'off';
    const meta = draft.variableMeta && draft.variableMeta[name];
    const isEnum = meta && meta.type === 'enum';
    const enumCount = isEnum ? meta.enumValues.length : 0;
    return `
              <div class="variable-row">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <input class="input variable-input" data-command-id="__new__" data-variable-name="${escapeAttr(name)}" value="${escapeAttr(value)}" />
                ${renderToggleSwitch3('__new__', name, rememberValue, 'variable-remember-toggle')}
                <button type="button" class="btn small ${isEnum ? 'primary' : 'secondary'} btn-open-enum-manager" data-var-name="${escapeAttr(name)}" data-command-id="" data-tooltip="Manage Enum values for this variable">
                  ${iconAdjustmentsSettings()} ${isEnum ? `Enum (${enumCount})` : 'Set Enum'}
                </button>
              </div>
            `;
  }).join('')}
          </div>
        </div>
        ` : ''}
        <div class="row full-width justify-content-flex-end mt-20">
          <button type="submit" class="btn medium primary">Add Command</button>
          <button type="button" id="btn-cancel-add-command" class="btn medium secondary action">Cancel</button>
        </div>
      </form>
    </section>
  `;
}

function renderCommandsTable(commands, groups) {
  if (!commands.length) {
    return '<p>No commands found for this filter.</p>';
  }

  const isSorting = uiState.sortingMode;

  const tableClasses = [
    'cmds-table commands-table main-table',
    !uiState.columnVisibility.description ? 'hide-description' : '',
    !uiState.columnVisibility.groups ? 'hide-groups' : '',
    isSorting ? 'sorting-mode' : '',
  ].filter(Boolean).join(' ');

  return `
    <div class="table-wrap">
      <table class="${tableClasses}" id="commands-sortable-table">
        <thead>
          <tr>
            ${isSorting ? '<th class="main-t-drag-handle-column"></th>' : ''}
            <th class="main-t-title-column">Title</th>
            <th class="main-t-description-column">Description</th>
            <th class="main-t-template-column">Template</th>
            <th class="main-t-groups-column">Groups</th>
            ${!isSorting ? '<th class="main-t-action-column">Actions</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${commands.map(function (command) {
    const titleHtml = command.helpUrl
      ? `<a class="cmd-title-link" data-url="${escapeAttr(command.helpUrl)}" data-tooltip="Open documentation">${escapeHtml(command.title)}</a>`
      : `<strong>${escapeHtml(command.title)}</strong>`;
    const _useVars = collectVariables([command.command]).filter(function (n) {return n !== 'workspaceFolder';});
    const _useMissing = getMissingVariables(command);
    const _useCtrlHint = _useVars.length > 0 && _useMissing.length === 0;
    const _useTitle = _useCtrlHint ? 'Use in terminal\nPress CTRL key to edit the variables' : 'Use in terminal';
    return `
              <tr data-command-id="${escapeAttr(command.id)}" draggable="${isSorting ? 'true' : 'false'}">
                ${isSorting ? `<td class="main-t-drag-handle-column drag-handle-cell"><span class="drag-handle" data-tooltip="Drag to reorder">${iconDragHandle()}</span></td>` : ''}
                <td class="main-t-title-column">${titleHtml}<br><span class="muted">${escapeHtml(command.id)}</span></td>
                <td class="main-t-description-column">${escapeHtml(command.description || '-')}</td>
                <td class="main-t-template-column"><pre class="template-cell">${escapeHtml(command.command)}</pre></td>
                <td class="main-t-groups-column">${escapeHtml(resolveGroupTitle(command.groupId || '', groups))}</td>
                ${!isSorting ? `<td class="main-t-action-column">
                <div class="actions-cell">
                  <button class="btn icon-btn success btn-run" data-command-id="${escapeAttr(command.id)}" data-tooltip="Run command">${iconRun()}</button>
                  ${command.command.includes('\n') ? `<button class="btn icon-btn secondary" disabled data-tooltip="Use is not available for multi-line commands">${iconUse()}</button>` : `<button class="btn icon-btn secondary btn-use action" data-command-id="${escapeAttr(command.id)}" data-tooltip="${escapeAttr(_useTitle)}">${iconUse()}</button>`}
                  <button class="btn icon-btn secondary btn-copy action" data-command-id="${escapeAttr(command.id)}" data-tooltip="Copy to clipboard">${iconCopy()}</button>
                  <button class="btn icon-btn secondary btn-edit action" data-command-id="${escapeAttr(command.id)}" data-tooltip="Edit command">${iconEdit()}</button>
                  <button class="btn icon-btn danger btn-delete-command" data-command-id="${escapeAttr(command.id)}" data-tooltip="Delete command">${iconDelete()}</button>
                  ${(function () {
          const _fs = getFavoriteScope(command.id);
          const _cls = _fs === 'none' ? 'secondary' : _fs === 'local' ? 'fav-state-local' : _fs === 'global' ? 'fav-state-global' : 'fav-state-both';
          const _icon = _fs === 'none' ? iconHeartPlus() : iconHeartActive();
          const _tip = _fs === 'none'
            ? 'Ctrl+Click: Add Global  •  Ctrl+Right-Click: Remove Global<br>Shift+Click: Add Local  •  Shift+Right-Click: Remove Local<br>Ctrl+Shift+Click: Add Both  •  Ctrl+Shift+Right-Click: Remove Both<br><span class="muted-tip">(Click to manage)</span>'
            : _fs === 'local' ? 'In Local Favorites<br>(click to manage)' : _fs === 'global' ? 'In Global Favorites<br>(click to manage)' : 'In Local &amp; Global Favorites<br>(click to manage)';
          return `<button class="btn icon-btn ${_cls} btn-add-favorite" data-command-id="${escapeAttr(command.id)}" data-tooltip="${escapeAttr(_tip)}" data-tooltip-pos="left">${_icon}</button>`;
        })()}
                </div>
                </td>` : ''}
              </tr>
            `;
  }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Reads the current DOM row order and syncs it back to state.data.commands,
 * then persists. Called after live DOM reordering completes (on dragend).
 *
 * Strategy:
 *  1. Collect new order of visible IDs from DOM.
 *  2. Find which indices in allCommands correspond to the visible set.
 *  3. Write the new order into exactly those indices (all other indices untouched).
 */
function syncCommandOrderFromDOM(tbody) {
  var rows = tbody.querySelectorAll('tr[data-command-id]');
  if (!rows.length) {return;}

  var allCommands = state.data.commands;

  // Step 1: new order of visible command IDs (as they appear in the DOM right now)
  var newOrderIds = [];
  rows.forEach(function (row) {
    newOrderIds.push(row.dataset.commandId);
  });

  // Step 2: build a set of visible IDs for fast lookup
  var visibleIdSet = {};
  newOrderIds.forEach(function (id) {visibleIdSet[id] = true;});

  // Step 3: find which positions in allCommands belong to the visible set
  var visibleIndices = [];
  for (var i = 0; i < allCommands.length; i++) {
    if (visibleIdSet[allCommands[i].id]) {
      visibleIndices.push(i);
    }
  }

  // Step 4: build a lookup map id → command object
  var cmdMap = {};
  allCommands.forEach(function (c) {cmdMap[c.id] = c;});

  // Step 5: write new order into exactly those positions
  newOrderIds.forEach(function (id, idx) {
    if (idx < visibleIndices.length && cmdMap[id]) {
      allCommands[visibleIndices[idx]] = cmdMap[id];
    }
  });

  persistDataThenRender('Order saved.');
}

/**
 * Binds live-reorder Drag & Drop on the sortable commands table.
 * Rows are physically moved in the DOM during dragover — no drop indicator line.
 * Supports auto-scroll when dragging near the top/bottom edges of the viewport.
 */
function bindDragAndDrop() {
  var table = document.getElementById('commands-sortable-table');
  if (!table) {return;}

  var draggedRow = null;
  var draggedId = null;
  var lastTargetId = null;
  var autoScrollTimer = null;
  var lastDragY = 0;
  var SCROLL_ZONE = 80;
  var SCROLL_SPEED = 12;

  function stopAutoScroll() {
    if (autoScrollTimer) {
      cancelAnimationFrame(autoScrollTimer);
      autoScrollTimer = null;
    }
  }

  function startAutoScroll() {
    stopAutoScroll();
    function frame() {
      var y = lastDragY;
      var vh = window.innerHeight;
      if (y < SCROLL_ZONE) {
        window.scrollBy(0, -SCROLL_SPEED * (1 - y / SCROLL_ZONE));
      } else if (y > vh - SCROLL_ZONE) {
        window.scrollBy(0, SCROLL_SPEED * ((y - (vh - SCROLL_ZONE)) / SCROLL_ZONE));
      }
      autoScrollTimer = requestAnimationFrame(frame);
    }
    autoScrollTimer = requestAnimationFrame(frame);
  }

  var tbody = table.querySelector('tbody');
  if (!tbody) {return;}

  // dragstart
  table.querySelectorAll('tr[draggable="true"]').forEach(function (row) {
    row.addEventListener('dragstart', function (e) {
      draggedRow = row;
      draggedId = row.dataset.commandId;
      lastTargetId = null;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', draggedId);
      // Delay so the ghost image captures the row before opacity drops
      setTimeout(function () {
        row.classList.add('row-dragging');
      }, 0);
      startAutoScroll();
    });

    // dragend — sync DOM order to state and persist
    row.addEventListener('dragend', function () {
      row.classList.remove('row-dragging');
      stopAutoScroll();
      if (draggedRow) {
        syncCommandOrderFromDOM(tbody);
      }
      draggedRow = null;
      draggedId = null;
      lastTargetId = null;
    });
  });

  // dragover — live DOM reorder
  tbody.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    lastDragY = e.clientY;

    if (!draggedRow) {return;}

    var targetRow = e.target.closest('tr[data-command-id]');
    if (!targetRow || targetRow === draggedRow) {return;}

    var targetId = targetRow.dataset.commandId;

    // Determine: insert before or after target based on mouse Y
    var rect = targetRow.getBoundingClientRect();
    var midY = rect.top + rect.height / 2;
    var insertBefore = e.clientY < midY;

    // Build a positional key to avoid redundant DOM moves
    var posKey = targetId + (insertBefore ? '-before' : '-after');
    if (posKey === lastTargetId) {return;}
    lastTargetId = posKey;

    // Move the dragged row in the DOM immediately
    if (insertBefore) {
      tbody.insertBefore(draggedRow, targetRow);
    } else {
      var nextSibling = targetRow.nextElementSibling;
      if (nextSibling) {
        tbody.insertBefore(draggedRow, nextSibling);
      } else {
        tbody.appendChild(draggedRow);
      }
    }
  });

  // drop — just prevent default; dragend handles the persist
  tbody.addEventListener('drop', function (e) {
    e.preventDefault();
  });
}

function renderEditTab() {
  const command = getEditingCommand();

  if (!command) {
    return `
      <section class="card">
        <p>Select command edit from Commands tab.</p>
      </section>
    `;
  }

  syncEditCommandDraftFromCommand(command);
  const editDraft = uiState.editCommandDraft;
  const targetCategoryId = editDraft.targetCategoryId || command.categoryId;
  const allCategories = state.data.categories || [];
  const targetCategory = allCategories.find(function (cat) {
    return cat.id === targetCategoryId;
  });
  const groups = targetCategory ? (targetCategory.groups || []) : [];
  const autoVarNames = getEnabledAutoVariableNames();
  const variables = collectVariables([editDraft.template || command.command]).filter(function (n) {return !autoVarNames.includes(n);});
  const commandDraft = getCommandDraft(command.id);
  const commandRemember = getCommandRemember(command.id);
  const isMoved = targetCategoryId !== command.categoryId;

  return `
    <section class="card">
      <h2>Edit Command</h2>
      <form id="form-edit-command" class="form-grid add-command-grid">
        <label class="add-command-title">Command Title<input id="edit-command-title" class="input" required value="${escapeAttr(editDraft.title)}" /></label>
        <label class="add-command-template">Command Template<div class="template-editor-wrap"><div class="template-highlight" aria-hidden="true"></div>
        <textarea id="edit-command-template" class="input template-textarea" required rows="1">${escapeHtml(editDraft.template)}</textarea>
        </div><div class="template-var-legend">

        <span class="legend-item legend-auto hidden" data-tooltip="Reserved variables that are automatically resolved.<br>
        They do not require the user to assign a value."><span class="legend-dot" aria-hidden="true"></span>auto resolved</span>

        <span class="legend-item legend-user hidden" data-tooltip="Variables that are defined by the user.<br>
        Their values must be set by the user."><span class="legend-dot" aria-hidden="true"></span>user defined</span>

        </div></label>
        <label class="full-width">Description<textarea id="edit-command-description" class="input" rows="2">${escapeHtml(editDraft.description)}</textarea></label>
        <div class="full-width grouped-tags-wrap">
          <span class="groups-label">Category:</span>
          ${renderCustomSelect(
    'edit-category-select-wrap',
    'edit-category-select-btn',
    'edit-category-select-menu',
    allCategories.map(function (cat) {return {value: cat.id, label: cat.title};}),
    targetCategoryId,
    'cs-btn-sm cs-btn-category',  // btnExtraClass
    false, // menuUp
    'cs-wrap-full' // `wrapExtraClass`
  )}
          ${isMoved ? `<span class="muted move-category-warning">${iconExclamationTriangle()} Moving to new category — (Please select a group from the list below)</span>` : ''}
        </div>
        <div class="full-width grouped-tags-wrap">
          <span class="groups-label">Groups:</span>
          <div class="inline-tags" id="edit-command-groups-tags">
            ${groups.length === 0 ? `<span class="muted">No groups in this category.</span>` : ''}
            ${groups.map(function (group) {
    return `<button type="button" class="tag edit-command-group-tag ${editDraft.groupId === group.id ? 'active' : ''}" data-group-id="${escapeAttr(group.id)}">${escapeHtml(group.title)}</button>`;
  }).join('')}
          </div>
        </div>
        <label class="full-width">Help URL (optional)<input id="edit-command-help-url" class="input" placeholder="https://docs.example.com/command" value="${escapeAttr(editDraft.helpUrl || '')}" /></label>
        ${variables.length ? `
        <div class="full-width mt-5">
          <h3>Command Variables:</h3>
          <div class="variables-list">
            <div class="variable-row">
              <span></span>
              <span></span>
              <span class="muted vars-store-location" data-tooltip="Local = saved per workspace only<br>Global = saved across all workspaces<br>Off = not saved">Variables store location</span>
              <span></span>
            </div>
            ${variables.map(function (name) {
    const value = commandDraft[name] || '';
    const rememberValue = commandRemember[name] || 'off';
    const meta = editDraft.variableMeta && editDraft.variableMeta[name];
    const isEnum = meta && meta.type === 'enum';
    const enumCount = isEnum ? meta.enumValues.length : 0;
    return `
              <div class="variable-row">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <input class="input variable-input" data-command-id="${escapeAttr(command.id)}" data-variable-name="${escapeAttr(name)}" value="${escapeAttr(value)}" />
                ${renderToggleSwitch3(command.id, name, rememberValue, 'variable-remember-toggle')}
                <button type="button" class="btn small ${isEnum ? 'primary' : 'secondary'} btn-open-enum-manager" data-var-name="${escapeAttr(name)}" data-command-id="${escapeAttr(command.id)}" data-tooltip="Manage Enum values">${iconAdjustmentsSettings()} ${isEnum ? `Enum (${enumCount})` : 'Set Enum'}</button>
              </div>
            `;
  }).join('')}
          </div>
        </div>
        ` : ''}
        ${command.lastRunAt ? `
        <div class="full-width mt-5">
          <span class="muted">Last Run: <strong data-tooltip="${escapeAttr(formatDateTime(command.lastRunAt))}">${escapeHtml(timeAgo(command.lastRunAt))}</strong> &nbsp;·&nbsp; ×${command.runCount || 0} runs</span>
        </div>
        ` : ''}
        <div class="row full-width justify-content-flex-end mt-20">
          <button type="submit" class="btn medium primary">Save Changes</button>
          <button type="button" id="btn-cancel-edit-command" class="btn medium secondary action">Cancel</button>
        </div>
      </form>
    </section>
  `;
}

function renderToggleSwitch3(commandId, varName, currentValue, extraClass) {
  const noWorkspace = !state.workspaceFolder;
  const opts = [
    {value: 'local', label: 'Local', disabled: noWorkspace},
    {value: 'off', label: 'Off', disabled: false},
    {value: 'global', label: 'Global', disabled: false},
  ];

  return `
    <div class="toggle-switch-3 ${escapeAttr(extraClass)}" data-command-id="${escapeAttr(commandId)}" data-variable-name="${escapeAttr(varName)}">
      ${opts.map(function (opt) {
    return `<button type="button" class="toggle-option-3 ${currentValue === opt.value ? 'active' : ''}" data-value="${opt.value}" ${opt.disabled ? 'disabled' : ''}>${opt.label}</button>`;
  }).join('')}
    </div>
  `;
}

function renderShellSelector() {
  const profiles = (state.terminalProfiles && state.terminalProfiles.profiles) || [];
  if (!profiles.length) {
    return '';
  }

  // Use profile name as unique identifier (avoids double-tick when two profiles share same path)
  const selectedShellName = runConfirmState.selectedShellName;
  const selectedLabel = selectedShellName || (state.terminalProfiles.defaultProfile || 'Default');

  const items = profiles.map(function (profile) {
    const isSelected = profile.name === selectedShellName;
    return `
      <div class="cs-item" role="menuitem" tabindex="-1" data-shell-name="${escapeAttr(profile.name)}" data-shell-path="${escapeAttr(profile.shellPath)}">
        <span class="cs-item-label">${escapeHtml(profile.name)}</span>
        ${isSelected ? checkmarkSvg : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="cs-wrap" id="shell-selector-wrap">
      <button class="cs-btn cs-btn-sm" type="button" aria-haspopup="menu" aria-expanded="false" id="shell-selector-btn">
        <span class="cs-btn-label">${escapeHtml(selectedLabel)}</span>
        ${chevronSvg}
      </button>
      <div class="cs-menu cs-menu-up" role="menu" id="shell-selector-menu" hidden>
        ${items}
      </div>
    </div>
  `;
}

function renderRunConfirmModal() {
  // Hide run confirm modal while variable input modal is open (returning to run confirm)
  if (!runConfirmState.commandId || (variableInputState.commandId && variableInputState.returnToRunConfirm)) {
    return '';
  }

  const command = (state.data.commands || []).find(function (item) {
    return item.id === runConfirmState.commandId;
  });

  const hasVariables = command ? collectVariables([command.command]).some(function (name) {
    return !getEnabledAutoVariableNames().includes(name);
  }) : false;

  return `
    <div class="modal-overlay" id="run-confirm-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box">
        <h3>Do you want to run this command?</h3>
        <pre class="modal-command-preview">${escapeHtml(runConfirmState.resolvedCommand)}</pre>
        <span class="muted run-cmd-warning">${iconExclamationTriangle()} This command will be executed immediately</span>
        <div class="row justify-content-flex-end">
        ${hasVariables ? `<button class="btn small secondary min-w65" id="btn-confirm-run-variables">Edit Variables</button>` : ''}
          ${renderShellSelector()}
          <button class="btn small success min-w65" id="btn-confirm-run-yes">Run</button>
          <button class="btn small secondary action min-w65" id="btn-confirm-run-no">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderVariableInputModal() {
  if (!variableInputState.commandId) {
    return '';
  }

  const vars = variableInputState.missingVariables;
  // Get the command to check variableMeta
  const cmdForMeta = (state.data.commands || []).find(function (c) {return c.id === variableInputState.commandId;});

  return `
    <div class="modal-overlay" id="variable-input-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box">
        <h3>Enter Variable Values</h3>
        <div class="variables-list">
          <div class="variable-row">
            <span></span>
            <span></span>
            <span class="muted vars-store-location">Variables store location</span>
          </div>
          ${vars.map(function (name) {
    const currentValue = variableInputState.inputValues[name] !== undefined
      ? variableInputState.inputValues[name]
      : (getCommandDraft(variableInputState.commandId)[name] || '');
    const rememberValue = variableInputState.rememberFlags[name] !== undefined
      ? variableInputState.rememberFlags[name]
      : (getCommandRemember(variableInputState.commandId)[name] || 'off');
    // Check if this variable has Enum metadata
    const enumMeta = cmdForMeta && cmdForMeta.variableMeta && cmdForMeta.variableMeta[name];
    const isEnum = enumMeta && enumMeta.type === 'enum' && enumMeta.enumValues && enumMeta.enumValues.length > 0;
    // Check if current value is one of the enum values
    const isCustomValue = isEnum && !enumMeta.enumValues.some(function (ev) {return ev.value === currentValue;});

    if (isEnum) {
      const enumOptions = enumMeta.enumValues.map(function (ev) {
        return {value: ev.value, label: ev.value, tooltip: ev.description || ''};
      }).concat([{value: '__custom__', label: '✏️ Custom value...'}]);
      const enumSelectedVal = isCustomValue ? '__custom__' : currentValue;
      return `
              <div class="variable-row variable-row-enum">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <div class="enum-input-wrap" data-variable-name="${escapeAttr(name)}">
                  ${renderCustomSelect(
        'enum-var-wrap-' + escapeAttr(name),
        'enum-var-btn-' + escapeAttr(name),
        'enum-var-menu-' + escapeAttr(name),
        enumOptions,
        enumSelectedVal,
        'cs-btn-sm cs-btn-enum-var', // btnExtraClass
        false, // menuUp
        'cs-wrap-full'  // 
      )}
                  <input
                    class="input variable-modal-input variable-modal-custom-input${isCustomValue ? '' : ' hidden'}"
                    data-variable-name="${escapeAttr(name)}"
                    value="${escapeAttr(currentValue)}"
                    placeholder="Enter custom value..."
                  />
                </div>
                ${renderToggleSwitch3(variableInputState.commandId, name, rememberValue, 'variable-modal-remember-toggle')}
              </div>
            `;
    }

    return `
              <div class="variable-row">
                <label class="variable-name">\${${escapeHtml(name)}}</label>
                <input
                  class="input variable-modal-input"
                  data-variable-name="${escapeAttr(name)}"
                  value="${escapeAttr(currentValue)}"
                  placeholder="Enter value..."
                />
                ${renderToggleSwitch3(variableInputState.commandId, name, rememberValue, 'variable-modal-remember-toggle')}
              </div>
            `;
  }).join('')}
        </div>
        <div class="row justify-content-flex-end mt-20">
        <span class="muted mr-auto">Enter the values before using them</span>
          <button class="btn small primary min-w65" id="btn-variable-input-confirm">Confirm</button>
          <button class="btn small secondary action min-w65" id="btn-variable-input-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderDeleteConfirmModal() {
  if (!deleteConfirmState.type) {
    return '';
  }

  var heading = '';
  var detailHtml = '';
  var confirmLabel = 'Delete';
  var confirmClass = 'btn small danger min-w65';

  if (deleteConfirmState.type === 'clearRecent') {
    heading = 'Clear Recent History?';
    confirmLabel = 'Clear';
    detailHtml = `<p class="modal-description">${escapeHtml(deleteConfirmState.title || 'This action cannot be undone.')}</p>`;
  } else if (deleteConfirmState.type === 'command') {
    heading = `Do you want to delete this command?`;
    detailHtml = `
      <p class="delete-confirm-command-name">${escapeHtml(deleteConfirmState.title)}</p>
      <pre class="modal-command-preview">${escapeHtml(deleteConfirmState.template)}</pre>
    `;
  } else {
    heading = `Do you want to delete this ${escapeHtml(deleteConfirmState.type)}?`;
    detailHtml = `<p class="modal-description">${escapeHtml(deleteConfirmState.title || 'This action cannot be undone.')}</p>`;
  }

  return `
    <div class="modal-overlay" id="delete-confirm-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box">
        <h3>${heading}</h3>
        ${detailHtml}
        <div class="row justify-content-flex-end">
          <button class="${confirmClass}" id="btn-confirm-delete-yes">${confirmLabel}</button>
          <button class="btn small secondary action min-w65" id="btn-confirm-delete-no">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderRecentCommandsTab() {
  const recentCommands = (state.data.commands || [])
    .filter(function (cmd) {return cmd.lastRunAt;})
    .slice()
    .sort(function (a, b) {return new Date(b.lastRunAt) - new Date(a.lastRunAt);});

  const totalRuns = recentCommands.reduce(function (sum, cmd) {return sum + (cmd.runCount || 0);}, 0);

  if (!recentCommands.length) {
    return `
      <section class="card">
        <div class="row between">
          <h2>Recent Commands</h2>
        </div>
        <p class="muted">No recent commands yet. Run or Use a command to see it here.</p>
      </section>
    `;
  }

  return `
    <section class="card">
      <div class="row between">
        <h2>Recent Commands</h2>
        <div class="row">
          <span class="muted total-runs">Total runs: <strong>${totalRuns}</strong></span>
          <button id="btn-clear-recent" class="btn danger small" data-tooltip="Clear all recent command history">Clear Recent</button>
        </div>
      </div>
      <div class="table-wrap recent-commands">
        <table class="cmds-table recent-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Template</th>
              <th>Last Run</th>
              <th>×Runs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${recentCommands.map(function (command) {
    const titleHtml = command.helpUrl
      ? `<a class="cmd-title-link" data-url="${escapeAttr(command.helpUrl)}" data-tooltip="Open documentation">${escapeHtml(command.title)}</a>`
      : `<strong>${escapeHtml(command.title)}</strong>`;
    const _useVars = collectVariables([command.command]).filter(function (n) {return n !== 'workspaceFolder';});
    const _useMissing = getMissingVariables(command);
    const _useCtrlHint = _useVars.length > 0 && _useMissing.length === 0;
    const _useTitle = _useCtrlHint ? 'Use in terminal\nPress CTRL key to edit the variables' : 'Use in terminal';
    return `
                <tr>
                  <td>${titleHtml}</td>
                  <td><pre class="template-cell">${escapeHtml(command.command)}</pre></td>
                  <td data-tooltip="${escapeAttr(formatDateTime(command.lastRunAt))}">${escapeHtml(timeAgo(command.lastRunAt))}</td>
                  <td><strong>×${command.runCount || 0}</strong></td>
                    <td>
                    <div class="actions-cell">
                      <button class="btn icon-btn success btn-run" data-command-id="${escapeAttr(command.id)}" data-tooltip="Run command">${iconRun()}</button>
                      ${command.command.includes('\n') ? `<button class="btn icon-btn secondary" disabled data-tooltip="Use is not available for multi-line commands">${iconUse()}</button>` : `<button class="btn icon-btn secondary btn-use action" data-command-id="${escapeAttr(command.id)}" data-tooltip="${escapeAttr(_useTitle)}">${iconUse()}</button>`}
                      <button class="btn icon-btn secondary btn-copy action" data-command-id="${escapeAttr(command.id)}" data-tooltip="Copy to clipboard">${iconCopy()}</button>
                      <button class="btn icon-btn secondary btn-edit action" data-command-id="${escapeAttr(command.id)}" data-tooltip="Edit command">${iconEdit()}</button>
                      ${(function () {
        const _fs = getFavoriteScope(command.id);
        const _cls = _fs === 'none' ? 'secondary' : _fs === 'local' ? 'fav-state-local' : _fs === 'global' ? 'fav-state-global' : 'fav-state-both';
        const _icon = _fs === 'none' ? iconHeartPlus() : iconHeartActive();
        const _tip = _fs === 'none' ? 'Add to favorites' : _fs === 'local' ? 'In Local Favorites (click to manage)' : _fs === 'global' ? 'In Global Favorites (click to manage)' : 'In Local &amp; Global Favorites (click to manage)';
        return `<button class="btn icon-btn ${_cls} btn-add-favorite" data-command-id="${escapeAttr(command.id)}" data-tooltip="${escapeAttr(_tip)}" data-tooltip-pos="left">${_icon}</button>`;
      })()}
                    </div>
                  </td>
                </tr>
              `;
  }).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function timeAgo(isoString) {
  if (!isoString) {return '–';}
  const diff = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) {return 'just now';}
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;}
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {return `${hours} hour${hours !== 1 ? 's' : ''} ago`;}
  const days = Math.floor(hours / 24);
  if (days < 30) {return `${days} day${days !== 1 ? 's' : ''} ago`;}
  const months = Math.floor(days / 30);
  if (months < 12) {return `${months} month${months !== 1 ? 's' : ''} ago`;}
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) !== 1 ? 's' : ''} ago`;
}

function formatDateTime(isoString) {
  if (!isoString) {return '';}
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

/**
 * Auto-resizes a textarea to fit its content.
 * Expands up to MAX_LINES lines, then shows vertical scrollbar.
 * @param {HTMLTextAreaElement} el
 */
function autoResizeTextarea(el) {
  if (!el) {return;}
  var MAX_LINES = 5;
  // Reset height to auto so we can measure the true content height
  el.classList.remove('ta-overflow');
  el.style.setProperty('--tr-textarea-h', 'auto');
  void el.offsetHeight; // Force synchronous reflow before reading scrollHeight
  var computed = getComputedStyle(el);
  var lineHeight = parseFloat(computed.lineHeight);
  if (!lineHeight || isNaN(lineHeight)) {
    lineHeight = parseFloat(computed.fontSize) * 1.5;
  }
  var paddingTop = parseFloat(computed.paddingTop) || 0;
  var paddingBottom = parseFloat(computed.paddingBottom) || 0;
  var maxHeight = lineHeight * MAX_LINES + paddingTop + paddingBottom;
  var newHeight = Math.min(el.scrollHeight, maxHeight);
  el.style.setProperty('--tr-textarea-h', newHeight + 'px');
  if (el.scrollHeight > maxHeight) {
    el.classList.add('ta-overflow');
  }
  // Sync highlight div height to match the textarea
  var highlightEl = el.previousElementSibling;
  if (highlightEl && highlightEl.classList.contains('template-highlight')) {
    highlightEl.style.height = newHeight + 'px';
  }
}

/**
 * Updates the syntax highlight overlay div for a template textarea.
 * Wraps ${varName} tokens in colored spans: .var-auto (reserved) or .var-user (user-defined).
 * @param {HTMLTextAreaElement} textarea
 */
function updateTemplateHighlight(textarea) {
  var highlightDiv = textarea.previousElementSibling;
  if (!highlightDiv || !highlightDiv.classList.contains('template-highlight')) {return;}
  var autoVarNames = getEnabledAutoVariableNames();
  var allVarNames = collectVariables([textarea.value]);
  var hasAuto = allVarNames.some(function (n) {return autoVarNames.includes(n);});
  var hasUser = allVarNames.some(function (n) {return !autoVarNames.includes(n);});
  var html = escapeHtml(textarea.value).replace(
    /\$\{([a-zA-Z0-9_]+)\}/g,
    function (match, name) {
      var cls = autoVarNames.includes(name) ? 'var-auto' : 'var-user';
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
  // Trailing \n prevents the last line from collapsing in height
  highlightDiv.innerHTML = html + '\n';
  // Keep scroll in sync
  highlightDiv.scrollTop = textarea.scrollTop;
  // Update legend visibility
  var legend = textarea.parentElement && textarea.parentElement.nextElementSibling;
  if (legend && legend.classList.contains('template-var-legend')) {
    var autoItem = legend.querySelector('.legend-auto');
    var userItem = legend.querySelector('.legend-user');
    if (autoItem) {autoItem.classList.toggle('hidden', !hasAuto);}
    if (userItem) {userItem.classList.toggle('hidden', !hasUser);}
  }
}

/**
 * Binds click-outside-to-dismiss behaviour for all modal overlays.
 * Each overlay uses data-dismiss-on-outside-click="true|false" to opt in/out.
 * Handlers are defined in modalDismissHandlers keyed by overlay id.
 */
const modalDismissHandlers = {
  'manage-modal-overlay': function () {
    manageModalState = {visible: false, mode: null, value: ''};
    render();
  },
  'enum-manager-overlay': function () {
    enumManagerState = {
      visible: false, commandId: null, varName: '',
      enumValues: [], editIndex: null,
      editTitle: '', editValue: '', editDescription: '',
    };
    render();
  },
  'ai-settings-overlay': function () {
    aiState.view = null;
    aiState.apiKeyInput = '';
    render();
  },
  'ai-prompt-overlay': function () {
    aiState.view = null;
    aiState.error = '';
    aiState.prompt = '';
    render();
  },
  'ai-results-overlay': function () {
    aiState.view = null;
    aiState.result = null;
    aiState.error = '';
    render();
  },
  'run-confirm-overlay': function () {
    runConfirmState = {commandId: null, resolvedCommand: '', selectedShellPath: runConfirmState.selectedShellPath, selectedShellName: runConfirmState.selectedShellName};
    render();
  },
  'variable-input-overlay': function () {
    variableInputState = {commandId: null, action: null, missingVariables: [], inputValues: {}, rememberFlags: {}, returnToRunConfirm: false};
    render();
  },
  'delete-confirm-overlay': function () {
    deleteConfirmState = {type: null, id: null, title: '', template: ''};
    render();
  },
  'ai-loading-overlay': function () {
    // No dismiss action for loading overlay
  },
  'ai-provider-setup-overlay': function () {
    aiProviderSetupModalState = {visible: false, providerName: null};
    render();
  },
};

function bindModalDismiss() {
  // --- Overlays that dismiss on outside click (true) ---
  document.querySelectorAll('.modal-overlay[data-dismiss-on-outside-click="true"]').forEach(function (overlay) {
    var handler = modalDismissHandlers[overlay.id];
    if (handler) {
      overlay.addEventListener('pointerdown', function (e) {
        if (e.target === overlay) {
          handler();
        }
      });
    }
  });

  // --- Overlays that do NOT dismiss (false) — flash the border instead ---
  document.querySelectorAll('.modal-overlay[data-dismiss-on-outside-click="false"]').forEach(function (overlay) {
    overlay.addEventListener('pointerdown', function (e) {
      if (e.target === overlay) {
        var box = overlay.querySelector('.modal-box');
        if (box) {
          box.classList.remove('modal-box-flash');
          void box.offsetWidth; // force reflow to restart animation
          box.classList.add('modal-box-flash');
          box.addEventListener('animationend', function () {
            box.classList.remove('modal-box-flash');
          }, {once: true});
        }
      }
    });
  });
}

function bindEvents() {
  bindTopActions();
  bindTabs();
  bindModalDismiss();

  // If currently editing, only bind edit tab events (regardless of activeTab)
  if (uiState.editingCommandId) {
    bindEditTabEvents();
    bindCommandActionButtons();
    return;
  }

  if (uiState.activeTab === 'recent') {
    bindRecentTabEvents();
  }

  if (uiState.activeTab === 'manage') {
    bindManageTabEvents();
  }

  if (uiState.activeTab === 'commands') {
    bindCommandsTabEvents();
  }

  if (uiState.activeTab === 'add') {
    bindAddCommandTabEvents();
  }

  if (uiState.activeTab === 'favorites') {
    bindFavoritesTabEvents();
  }

  if (uiState.activeTab === 'variables') {
    bindVariablesTabEvents();
  }

  bindCommandActionButtons();
}

// ─── Variables Tab ─────────────────────────────────────────────────────────────

function renderVariablesTab() {
  const autoVars = state.autoVariables || [];

  return `
    <section class="card">
      <h2>Auto Variables</h2>
      <p class="muted">These variables are automatically resolved in your commands — no manual input needed.</p>
      <div class="auto-vars-list">
        ${autoVars.length === 0
      ? '<p class="muted">No auto variables defined.</p>'
      : autoVars.map(function (varDef) {
        return `
          <div class="auto-var-row ${varDef.enabled ? '' : 'auto-var-disabled'}">
            <div class="auto-var-toggle">
              <label class="toggle-label">
                <input
                  type="checkbox"
                  class="auto-var-checkbox"
                  data-var-name="${escapeAttr(varDef.name)}"
                  ${varDef.enabled ? 'checked' : ''}
                />
              </label>
            </div>
            <div class="auto-var-info">
              <div class="auto-var-name">
                <code class="auto-var-name-code" data-copy-value="${escapeAttr('${' + varDef.name + '}')}" data-tooltip="Copy variable">\${${escapeHtml(varDef.name)}}</code>
                <span>${escapeHtml(varDef.label)}</span>
              </div>
              <div class="auto-var-description">${escapeHtml(varDef.description)}</div>
              ${varDef.enabled ? `<div class="auto-var-preview">
                <span>Current value: </span>
                <code class="auto-var-value">${escapeHtml(varDef.currentValue || '—')}</code>
              </div>` : ''}
              ${varDef.configurable && varDef.enabled ? `<div class="auto-var-config">
                ${renderAutoVarConfig(varDef)}
              </div>` : ''}
            </div>
          </div>
        `;
      }).join('')
    }
      </div>
    </section>
  `;
}

function renderAutoVarConfig(varDef) {
  if (varDef.name === 'date' && varDef.configOptions && varDef.configOptions.length > 0) {
    return renderCustomSelect(
      'auto-var-date-format-wrap',
      'auto-var-date-format-btn',
      'auto-var-date-format-menu',
      varDef.configOptions.map(function (f) {
        return {value: f, label: f};
      }),
      varDef.config && varDef.config.format ? varDef.config.format : 'YYYY-MM-DD',
      'cs-btn-sm',
      false,
      ''
    );
  }
  return '';
}

function bindVariablesTabEvents() {
  // Checkbox to enable/disable a variable
  document.querySelectorAll('.auto-var-checkbox').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      const varName = checkbox.dataset.varName;
      const newSettings = JSON.parse(JSON.stringify(state.autoVariablesSettings || {}));
      if (!newSettings[varName]) {
        newSettings[varName] = {};
      }
      newSettings[varName].enabled = checkbox.checked;
      state.autoVariablesSettings = newSettings;
      vscode.postMessage({
        type: 'saveAutoVariablesSettings',
        payload: newSettings,
      });
    });
  });

  // Copy variable name when clicking on a code element
  document.querySelectorAll('.auto-var-name-code').forEach(function (el) {
    el.addEventListener('click', function () {
      const value = el.dataset.copyValue;
      if (value) {
        navigator.clipboard.writeText(value).then(function () {
          el.classList.remove('auto-var-copy-success');
          void el.offsetWidth; // force reflow to restart animation
          el.classList.add('auto-var-copy-success');
          el.addEventListener('animationend', function () {
            el.classList.remove('auto-var-copy-success');
          }, {once: true});
        });
      }
    });
  });

  // Change the date format
  bindCustomSelect(
    'auto-var-date-format-wrap',
    'auto-var-date-format-btn',
    'auto-var-date-format-menu',
    function (selectedFormat) {
      const newSettings = JSON.parse(JSON.stringify(state.autoVariablesSettings || {}));
      if (!newSettings['date']) {
        newSettings['date'] = {enabled: true};
      }
      if (!newSettings['date'].config) {
        newSettings['date'].config = {};
      }
      newSettings['date'].config.format = selectedFormat;
      state.autoVariablesSettings = newSettings;
      vscode.postMessage({
        type: 'saveAutoVariablesSettings',
        payload: newSettings,
      });
    }
  );
}

function bindRecentTabEvents() {
  const clearRecentButton = document.getElementById('btn-clear-recent');

  if (clearRecentButton) {
    clearRecentButton.addEventListener('click', function () {
      deleteConfirmState = {
        type: 'clearRecent',
        id: null,
        title: 'All recent history will be cleared.',
        template: '',
      };
      render();
    });
  }
}

function bindTopActions() {
  const openCommandsFileButton = document.getElementById('btn-open-commands-file');
  const openGlobalVariablesFileButton = document.getElementById('btn-open-global-variables-file');
  const openLocalVariablesFileButton = document.getElementById('btn-open-local-variables-file');

  if (openCommandsFileButton) {
    openCommandsFileButton.addEventListener('click', function () {
      vscode.postMessage({type: 'openCommandsFile'});
    });
  }

  if (openGlobalVariablesFileButton) {
    openGlobalVariablesFileButton.addEventListener('click', function () {
      vscode.postMessage({type: 'openGlobalVariablesFile'});
    });
  }

  if (openLocalVariablesFileButton) {
    openLocalVariablesFileButton.addEventListener('click', function () {
      vscode.postMessage({type: 'openLocalVariablesFile'});
    });
  }
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach(function (tabButton) {
    tabButton.addEventListener('click', function () {
      const nextTab = tabButton.dataset.tab;

      // Switching tabs while editing → discard editing state
      if (uiState.editingCommandId && nextTab !== uiState.activeTab) {
        uiState.editingCommandId = null;
        uiState.editCommandDraft = {title: '', template: '', description: '', groupId: ''};
      }

      // Exit sort mode when switching away from commands tab
      if (uiState.sortingMode && nextTab !== 'commands') {
        uiState.sortingMode = false;
      }

      uiState.activeTab = nextTab;
      // Persist only the main saveable tabs (not 'add' which is a transient form state)
      const SAVED_TABS = ['recent', 'favorites', 'manage', 'commands', 'variables'];
      if (SAVED_TABS.includes(nextTab)) {
        try {localStorage.setItem('selectedTab', nextTab);} catch { }
      }
      render();
    });
  });
}

function bindManageTabEvents() {
  // --- Category item click (select category) ---
  document.querySelectorAll('.manage-item[data-category-id]').forEach(function (item) {
    item.addEventListener('click', function (e) {
      // Don't trigger selection if a button inside was clicked
      if (e.target.closest('button')) {
        return;
      }

      setSelectedCategory(item.dataset.categoryId);
      uiState.selectedGroupId = 'all';
      render();
    });
  });

  // --- Group item click (select group) ---
  document.querySelectorAll('.manage-item[data-group-id]').forEach(function (item) {
    item.addEventListener('click', function (e) {
      if (e.target.closest('button')) {
        return;
      }

      uiState.selectedGroupId = item.dataset.groupId;
      render();
    });
  });

  // --- Open Add Category Modal ---
  const addCategoryBtn = document.getElementById('btn-open-add-category-modal');
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', function () {
      manageModalState = {visible: true, mode: 'add-category', value: ''};
      render();
      const input = document.getElementById('manage-modal-input');
      if (input) {
        input.focus();
      }
    });
  }

  // --- Open Add Group Modal ---
  const addGroupBtn = document.getElementById('btn-open-add-group-modal');
  if (addGroupBtn) {
    addGroupBtn.addEventListener('click', function () {
      manageModalState = {visible: true, mode: 'add-group', value: ''};
      render();
      const input = document.getElementById('manage-modal-input');
      if (input) {
        input.focus();
      }
    });
  }

  // --- Rename Category buttons ---
  document.querySelectorAll('.btn-rename-category').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const categoryId = btn.dataset.categoryId;
      const categoryTitle = btn.dataset.categoryTitle;
      setSelectedCategory(categoryId);
      manageModalState = {visible: true, mode: 'rename-category', value: categoryTitle};
      render();
      const input = document.getElementById('manage-modal-input');
      if (input) {
        input.focus();
        input.select();
      }
    });
  });

  // --- Delete Category buttons ---
  document.querySelectorAll('.btn-delete-category').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const categoryId = btn.dataset.categoryId;
      const categoryTitle = btn.dataset.categoryTitle;
      setSelectedCategory(categoryId);
      deleteConfirmState = {
        type: 'category',
        id: categoryId,
        title: categoryTitle,
      };
      render();
    });
  });

  // --- Rename Group buttons ---
  document.querySelectorAll('.btn-rename-group').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const groupId = btn.dataset.groupId;
      const groupTitle = btn.dataset.groupTitle;
      uiState.selectedGroupId = groupId;
      manageModalState = {visible: true, mode: 'rename-group', value: groupTitle};
      render();
      const input = document.getElementById('manage-modal-input');
      if (input) {
        input.focus();
        input.select();
      }
    });
  });

  // --- Delete Group buttons ---
  document.querySelectorAll('.btn-delete-group').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const groupId = btn.dataset.groupId;
      const groupTitle = btn.dataset.groupTitle;
      uiState.selectedGroupId = groupId;
      deleteConfirmState = {
        type: 'group',
        id: groupId,
        title: groupTitle,
      };
      render();
    });
  });

  // --- Modal Confirm ---
  const modalConfirmBtn = document.getElementById('btn-manage-modal-confirm');
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', function () {
      executeManageModalConfirm();
    });
  }

  // --- Modal Cancel ---
  const modalCancelBtn = document.getElementById('btn-manage-modal-cancel');
  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', function () {
      manageModalState = {visible: false, mode: null, value: ''};
      render();
    });
  }

  // --- Modal Input: confirm on Enter ---
  const modalInput = document.getElementById('manage-modal-input');
  if (modalInput) {
    modalInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeManageModalConfirm();
      }
      if (e.key === 'Escape') {
        manageModalState = {visible: false, mode: null, value: ''};
        render();
      }
    });
  }

}

function executeManageModalConfirm() {
  const input = document.getElementById('manage-modal-input');
  const value = input ? input.value.trim() : '';
  const mode = manageModalState.mode;

  if (!value) {
    showNotice('Name is required.', iconExclamationTriangle(), 'warning');
    if (input) {
      input.focus();
    }
    return;
  }

  if (mode === 'add-category') {
    const newCategory = {
      id: generateEntityId('cat'),
      title: value,
      groups: [],
    };
    state.data.categories.push(newCategory);
    setSelectedCategory(newCategory.id);
    uiState.selectedGroupId = 'all';
    manageModalState = {visible: false, mode: null, value: ''};
    persistDataThenRender('Category added and saved.');
    return;
  }

  if (mode === 'rename-category') {
    const category = getSelectedCategory();
    if (category) {
      category.title = value;
    }
    manageModalState = {visible: false, mode: null, value: ''};
    persistDataThenRender('Category renamed and saved.');
    return;
  }

  if (mode === 'add-group') {
    const selectedCategory = getSelectedCategory();
    if (!selectedCategory) {
      showNotice('Select a category first.', iconExclamationTriangle(), 'warning');
      return;
    }
    const newGroup = {
      id: generateEntityId('grp'),
      title: value,
    };
    selectedCategory.groups = selectedCategory.groups || [];
    selectedCategory.groups.push(newGroup);
    uiState.selectedGroupId = newGroup.id;
    manageModalState = {visible: false, mode: null, value: ''};
    persistDataThenRender('Group added and saved.');
    return;
  }

  if (mode === 'rename-group') {
    const selectedCategory = getSelectedCategory();
    if (!selectedCategory) {
      return;
    }
    const group = (selectedCategory.groups || []).find(function (g) {
      return g.id === uiState.selectedGroupId;
    });
    if (group) {
      group.title = value;
    }
    manageModalState = {visible: false, mode: null, value: ''};
    persistDataThenRender('Group renamed and saved.');
    return;
  }
}

/**
 * Generic custom dropdown renderer.
 * @param {string} wrapperId      - id for the .cs-wrap element
 * @param {string} btnId          - id for the toggle button
 * @param {string} menuId         - id for the .cs-menu element
 * @param {Array<{value:string, label:string}>} options - list of items
 * @param {string} selectedValue  - currently selected value
 * @param {string} [btnExtraClass]  - extra CSS class(es) for the button
 * @param {boolean} [menuUp]        - open the menu upward (cs-menu-up)
 * @param {string} [wrapExtraClass] - extra CSS class(es) for the .cs-wrap wrapper
 *   Use 'cs-wrap-full' to make the dropdown stretch to 100% width.
 * @returns {string} HTML string
 */
function renderCustomSelect(wrapperId, btnId, menuId, options, selectedValue, btnExtraClass, menuUp, wrapExtraClass) {

  const selectedOption = options.find(function (o) {return o.value === selectedValue;});
  const selectedLabel = selectedOption ? selectedOption.label : (options.length ? options[0].label : '—');

  const items = options.map(function (opt) {
    const isSelected = opt.value === selectedValue;
    return `
      <div class="cs-item" role="menuitem" tabindex="-1" data-value="${escapeAttr(opt.value)}"${opt.tooltip ? ` data-tooltip="${escapeAttr(opt.tooltip)}"` : ''}>
        <span class="cs-item-label">${escapeHtml(opt.label)}</span>
        ${isSelected ? checkmarkSvg : ''}
      </div>
    `;
  }).join('');

  const menuClass = `cs-menu${menuUp ? ' cs-menu-up' : ''}`;
  const wrapClass = `cs-wrap${wrapExtraClass ? ' ' + wrapExtraClass : ''}`;

  return `
    <div class="${wrapClass}" id="${escapeAttr(wrapperId)}">
      <button class="cs-btn${btnExtraClass ? ' ' + btnExtraClass : ''}" type="button" aria-haspopup="menu" aria-expanded="false" id="${escapeAttr(btnId)}">
        <span class="cs-btn-label">${escapeHtml(selectedLabel)}</span>
        ${chevronSvg}
      </button>
      <div class="${menuClass}" role="menu" id="${escapeAttr(menuId)}" hidden>
        ${items}
      </div>
    </div>
  `;
}

/**
 * Generic custom dropdown event binder.
 * @param {string} wrapperId - id of the .cs-wrap element
 * @param {string} btnId     - id of the toggle button
 * @param {string} menuId    - id of the .cs-menu element
 * @param {function(string):void} onChange - callback receiving the selected value
 */
function bindCustomSelect(wrapperId, btnId, menuId, onChange) {
  const wrap = document.getElementById(wrapperId);
  const btn = document.getElementById(btnId);
  const menu = document.getElementById(menuId);

  if (!btn || !menu) {return;}

  function closeMenu() {
    if (!menu.hidden) {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
    document.removeEventListener('pointerdown', onPointerDown, true);
    window.removeEventListener('blur', onWindowBlur);
  }

  function onPointerDown(e) {
    if (wrap && !wrap.contains(e.target)) {closeMenu();}
  }

  function onWindowBlur() {closeMenu();}

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!menu.hidden) {
      closeMenu();
    } else {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      document.addEventListener('pointerdown', onPointerDown, true);
      window.addEventListener('blur', onWindowBlur);
    }
  });


  menu.querySelectorAll('.cs-item').forEach(function (item) {
    item.addEventListener('click', function () {
      // Update button label to reflect the newly selected item
      var labelEl = btn.querySelector('.cs-btn-label');
      var itemLabelEl = item.querySelector('.cs-item-label');
      if (labelEl && itemLabelEl) {
        labelEl.textContent = itemLabelEl.textContent;
      }
      // Move the checkmark to the newly selected item
      menu.querySelectorAll('.cs-check').forEach(function (el) {el.remove();});
      item.insertAdjacentHTML('beforeend', checkmarkSvg);
      onChange(item.dataset.value);
      closeMenu();
    });
    item.addEventListener('mouseenter', function () {item.setAttribute('data-highlighted', '');});
    item.addEventListener('mouseleave', function () {item.removeAttribute('data-highlighted');});
  });
}

function renderCustomCategorySelect() {
  const categories = state.data.categories || [];
  const selected = getSelectedCategory();
  const selectedTitle = selected ? selected.title : 'Select category';

  const items = categories.map(function (category) {
    const isSelected = category.id === uiState.selectedCategoryId;
    return `
      <div class="cs-item" role="menuitem" tabindex="-1" data-value="${escapeAttr(category.id)}">
        <span class="cs-item-label">${escapeHtml(category.title)}</span>
        ${isSelected ? checkmarkSvg : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="cs-wrap" id="custom-category-select">
      <button class="cs-btn" type="button" aria-haspopup="menu" aria-expanded="false" id="cs-btn-toggle">
        <span class="cs-btn-label">${escapeHtml(selectedTitle)}</span>
        ${chevronSvg}
      </button>
      <div class="cs-menu" role="menu" id="cs-menu" hidden>
        ${items}
      </div>
    </div>
  `;
}

function renderColumnToggleDropdown() {

  const columns = [
    {key: 'description', label: 'Description'},
    {key: 'groups', label: 'Groups'},
  ];

  const items = columns.map(function (col) {
    const checked = uiState.columnVisibility[col.key];
    return `
      <label class="col-toggle-item" data-col-key="${escapeAttr(col.key)}">
        <input type="checkbox" class="col-toggle-checkbox" data-col-key="${escapeAttr(col.key)}" ${checked ? 'checked' : ''} />
        <span class="col-toggle-label">${escapeHtml(col.label)}</span>
      </label>
    `;
  }).join('');

  return `
    <div class="cs-wrap col-toggle-wrap" id="col-toggle-wrap">
      <button class="cs-btn cs-btn-col-toggle" type="button" aria-haspopup="menu" aria-expanded="false" id="col-toggle-btn" data-tooltip="Show/Hide Columns">
        ${columnSvg}
        <span class="cs-btn-label col-toggle-btn-label">Columns</span>
        ${chevronSvg}
      </button>
      <div class="cs-menu col-toggle-menu" id="col-toggle-menu" hidden>
        <div class="col-toggle-header">Show/Hide Columns</div>
        ${items}
      </div>
    </div>
  `;
}

function bindCommandsTabEvents() {
  // --- Custom category select ---
  const csWrap = document.getElementById('custom-category-select');
  const csBtn = document.getElementById('cs-btn-toggle');
  const csMenu = document.getElementById('cs-menu');

  if (csBtn && csMenu) {
    // Helper: close the menu and remove listeners
    function closeMenu() {
      if (!csMenu.hidden) {
        csMenu.hidden = true;
        csBtn.setAttribute('aria-expanded', 'false');
      }
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('blur', onWindowBlur);
    }

    // Pointer down anywhere outside the wrap → close
    function onPointerDown(e) {
      if (csWrap && !csWrap.contains(e.target)) {
        closeMenu();
      }
    }

    // Window loses focus (user clicks outside VS Code / webview) → close
    function onWindowBlur() {
      closeMenu();
    }

    // Toggle open/close
    csBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = !csMenu.hidden;

      if (isOpen) {
        closeMenu();
      } else {
        csMenu.hidden = false;
        csBtn.setAttribute('aria-expanded', 'true');
        // Register outside-click and blur listeners
        document.addEventListener('pointerdown', onPointerDown, true);
        window.addEventListener('blur', onWindowBlur);
      }
    });

    // Item click → select + close
    csMenu.querySelectorAll('.cs-item').forEach(function (item) {
      item.addEventListener('click', function () {
        setSelectedCategory(item.dataset.value);
        uiState.selectedGroupId = 'all';
        closeMenu();
        render();
      });

      // Hover: add/remove data-highlighted
      item.addEventListener('mouseenter', function () {
        item.setAttribute('data-highlighted', '');
      });
      item.addEventListener('mouseleave', function () {
        item.removeAttribute('data-highlighted');
      });
    });
  }

  document.querySelectorAll('.group-filter-tag').forEach(function (tagButton) {
    tagButton.addEventListener('click', function () {
      uiState.selectedGroupId = tagButton.dataset.groupId;
      // Exit sort mode when switching groups
      if (uiState.sortingMode) {
        uiState.sortingMode = false;
      }
      render();
    });
  });

  // --- Sort Toggle Button ---
  var sortBtn = document.getElementById('btn-toggle-sort');
  if (sortBtn) {
    sortBtn.addEventListener('click', function () {
      uiState.sortingMode = !uiState.sortingMode;
      render();
    });
  }

  // --- Bind Drag & Drop if sorting mode is active ---
  if (uiState.sortingMode) {
    bindDragAndDrop();
  }

  // --- Column Toggle Dropdown ---
  const colToggleWrap = document.getElementById('col-toggle-wrap');
  const colToggleBtn = document.getElementById('col-toggle-btn');
  const colToggleMenu = document.getElementById('col-toggle-menu');

  if (colToggleBtn && colToggleMenu) {
    function closeColMenu() {
      if (!colToggleMenu.hidden) {
        colToggleMenu.hidden = true;
        colToggleBtn.setAttribute('aria-expanded', 'false');
      }
      document.removeEventListener('pointerdown', onColPointerDown, true);
    }

    function onColPointerDown(e) {
      if (colToggleWrap && !colToggleWrap.contains(e.target)) {
        closeColMenu();
      }
    }

    colToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = !colToggleMenu.hidden;
      if (isOpen) {
        closeColMenu();
      } else {
        colToggleMenu.hidden = false;
        colToggleBtn.setAttribute('aria-expanded', 'true');
        document.addEventListener('pointerdown', onColPointerDown, true);
      }
    });

    // Checkbox change → update state + re-render table only (keep menu open)
    colToggleMenu.querySelectorAll('.col-toggle-checkbox').forEach(function (checkbox) {
      checkbox.addEventListener('change', function (e) {
        // Stop propagation so the pointerdown outside-click doesn't fire and close the menu
        e.stopPropagation();
        const colKey = checkbox.dataset.colKey;
        if (colKey && Object.prototype.hasOwnProperty.call(uiState.columnVisibility, colKey)) {
          uiState.columnVisibility[colKey] = checkbox.checked;
          // Persist to localStorage
          try {
            localStorage.setItem('columnVisibility', JSON.stringify(uiState.columnVisibility));
          } catch { }
          // Re-render just the table panel without closing the menu
          const tablePanel = document.querySelector('.table-panel');
          if (tablePanel) {
            const groups = getSelectedCategoryGroups();
            const commands = getVisibleCommands();
            tablePanel.innerHTML = renderCommandsTable(commands, groups);
            bindCommandActionButtons();
          }
        }
      });
    });
  }
}

function bindAddCommandTabEvents() {
  const newCommandForm = document.getElementById('form-new-command');
  const cancelButton = document.getElementById('btn-cancel-add-command');

  const newCommandTitleInput = document.getElementById('new-command-title');
  const newCommandTemplateInput = document.getElementById('new-command-template');
  const newCommandDescriptionInput = document.getElementById('new-command-description');
  const newCommandHelpUrlInput = document.getElementById('new-command-help-url');

  if (newCommandTitleInput) {
    newCommandTitleInput.addEventListener('input', function () {
      uiState.newCommandDraft.title = newCommandTitleInput.value;
    });
  }

  if (newCommandTemplateInput) {
    newCommandTemplateInput.addEventListener('input', function () {
      uiState.newCommandDraft.template = newCommandTemplateInput.value;
      // Preserve cursor position before re-render
      const cursorStart = newCommandTemplateInput.selectionStart;
      const cursorEnd = newCommandTemplateInput.selectionEnd;
      render();
      // Restore focus and cursor after re-render
      const restored = document.getElementById('new-command-template');
      if (restored) {
        restored.focus();
        restored.setSelectionRange(cursorStart, cursorEnd);
      }
    });
  }

  if (newCommandDescriptionInput) {
    newCommandDescriptionInput.addEventListener('input', function () {
      uiState.newCommandDraft.description = newCommandDescriptionInput.value;
    });
  }

  if (newCommandHelpUrlInput) {
    newCommandHelpUrlInput.addEventListener('input', function () {
      uiState.newCommandDraft.helpUrl = newCommandHelpUrlInput.value;
    });
  }

  // --- Enum Manager buttons (in Add Command tab) ---
  document.querySelectorAll('.btn-open-enum-manager').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const varName = btn.dataset.varName;
      const commandId = btn.dataset.commandId || null;

      // Get current enum values for this variable from the appropriate source
      let currentEnumValues = [];
      if (commandId === null || commandId === '') {
        // New command context
        const meta = uiState.newCommandDraft.variableMeta && uiState.newCommandDraft.variableMeta[varName];
        currentEnumValues = (meta && meta.type === 'enum' && meta.enumValues) ? meta.enumValues.map(function (e) {return Object.assign({}, e);}) : [];
      } else {
        // Edit command context
        const meta = uiState.editCommandDraft.variableMeta && uiState.editCommandDraft.variableMeta[varName];
        currentEnumValues = (meta && meta.type === 'enum' && meta.enumValues) ? meta.enumValues.map(function (e) {return Object.assign({}, e);}) : [];
      }

      enumManagerState = {
        visible: true,
        commandId: commandId === '' ? null : commandId,
        varName,
        enumValues: currentEnumValues,
        editIndex: null,
        editTitle: '',
        editValue: '',
        editDescription: '',
      };
      render();
    });
  });

  // --- Variable inputs in Add Command tab ---
  document.querySelectorAll('.variable-input[data-command-id="__new__"]').forEach(function (input) {
    input.addEventListener('input', function () {
      const variableName = input.dataset.variableName;
      const draft = getCommandDraft('__new__');
      draft[variableName] = input.value;
      uiState.commandDrafts['__new__'] = draft;
    });
  });

  // --- Toggle switches in Add Command tab ---
  document.querySelectorAll('.variable-remember-toggle[data-command-id="__new__"]').forEach(function (container) {
    container.querySelectorAll('.toggle-option-3').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) {return;}
        container.querySelectorAll('.toggle-option-3').forEach(function (b) {b.classList.remove('active');});
        btn.classList.add('active');
        const variableName = container.dataset.variableName;
        const value = btn.dataset.value;
        const rememberMap = getCommandRemember('__new__');
        rememberMap[variableName] = value;
        uiState.commandRemember['__new__'] = rememberMap;
      });
    });
  });

  document.querySelectorAll('.new-command-group-tag').forEach(function (tagButton) {
    tagButton.addEventListener('click', function () {
      const groupId = tagButton.dataset.groupId;
      uiState.newCommandDraft.groupId = uiState.newCommandDraft.groupId === groupId ? '' : groupId;
      render();
    });
  });

  if (cancelButton) {
    cancelButton.addEventListener('click', function () {
      uiState.newCommandDraft = {visible: false, title: '', template: '', description: '', groupId: '', helpUrl: '', variableMeta: {}};
      delete uiState.commandDrafts['__new__'];
      delete uiState.commandRemember['__new__'];
      uiState.activeTab = 'commands';
      render();
    });
  }

  if (newCommandForm) {
    newCommandForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const selectedCategory = getSelectedCategory();

      if (!selectedCategory) {
        showNotice('Select category first.', iconExclamationTriangle(), 'warning');
        render();
        return;
      }

      const titleInput = document.getElementById('new-command-title');
      const descriptionInput = document.getElementById('new-command-description');
      const templateInput = document.getElementById('new-command-template');
      const helpUrlInputEl = document.getElementById('new-command-help-url');

      const title = titleInput ? titleInput.value.trim() : '';
      const description = descriptionInput ? descriptionInput.value.trim() : '';
      const commandTemplate = templateInput ? templateInput.value.trim() : '';
      const helpUrl = helpUrlInputEl ? helpUrlInputEl.value.trim() : '';
      const groupId = uiState.newCommandDraft.groupId;
      const variableMeta = uiState.newCommandDraft.variableMeta || {};

      if (title.length < 3) {
        showError('Command Title must be at least 3 characters.');
        render();
        return;
      }

      if (!commandTemplate) {
        showError('Command Template is required.');
        render();
        return;
      }

      if (!groupId) {
        showError('Please select at least one group from the list below.', iconExclamationTriangle(), 'warning');
        render();
        return;
      }

      const newCommand = {
        id: generateEntityId('cmd'),
        title,
        description,
        command: commandTemplate,
        categoryId: selectedCategory.id,
        groupId,
        ...(helpUrl ? {helpUrl} : {}),
        ...(Object.keys(variableMeta).length > 0 ? {variableMeta} : {}),
      };

      const newCommandId = newCommand.id;
      state.data.commands.push(newCommand);

      // Read latest variable values from DOM before state is cleared
      document.querySelectorAll('.variable-input[data-command-id="__new__"]').forEach(function (varInput) {
        const vname = varInput.dataset.variableName;
        if (vname) {
          const d = getCommandDraft('__new__');
          d[vname] = varInput.value;
        }
      });

      // Read latest toggle states from DOM
      document.querySelectorAll('.variable-remember-toggle[data-command-id="__new__"]').forEach(function (container) {
        const vname = container.dataset.variableName;
        const activeBtn = container.querySelector('.toggle-option-3.active');
        if (vname && activeBtn) {
          const rm = getCommandRemember('__new__');
          rm[vname] = activeBtn.dataset.value;
        }
      });

      // Transfer variable data from '__new__' to the real newCommandId
      if (uiState.commandDrafts['__new__']) {
        uiState.commandDrafts[newCommandId] = uiState.commandDrafts['__new__'];
        delete uiState.commandDrafts['__new__'];
      }
      if (uiState.commandRemember['__new__']) {
        uiState.commandRemember[newCommandId] = uiState.commandRemember['__new__'];
        delete uiState.commandRemember['__new__'];
      }

      uiState.newCommandDraft = {visible: false, title: '', template: '', description: '', groupId: '', helpUrl: '', variableMeta: {}};
      uiState.activeTab = 'commands';
      uiState.pendingScrollCommandId = newCommandId;
      persistDataThenRender('Command added and saved.');
      persistCommandVariables();
    });
  }
}

function bindEditTabEvents() {
  const command = getEditingCommand();
  const form = document.getElementById('form-edit-command');

  if (!command || !form) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    syncEditCommandDraftFromDom();
    const draft = uiState.editCommandDraft;

    const titleTrimmed = draft.title ? draft.title.trim() : '';
    const templateTrimmed = draft.template ? draft.template.trim() : '';

    if (titleTrimmed.length < 3) {
      showError('Command Title must be at least 3 characters.');
      render();
      return;
    }

    if (!templateTrimmed) {
      showError('Command Template is required.');
      render();
      return;
    }

    // Apply trimmed values
    draft.title = titleTrimmed;
    draft.template = templateTrimmed;

    if (!draft.groupId) {
      showError('Please select at least one group from the list below.', iconExclamationTriangle(), 'warning');
      render();
      return;
    }

    command.title = draft.title;
    command.description = draft.description;
    command.command = draft.template;
    command.groupId = draft.groupId;

    // Apply category move if changed
    if (draft.targetCategoryId && draft.targetCategoryId !== command.categoryId) {
      command.categoryId = draft.targetCategoryId;
    }

    // Save helpUrl
    if (draft.helpUrl) {
      command.helpUrl = draft.helpUrl;
    } else {
      delete command.helpUrl;
    }

    // Read variable values from DOM before re-render
    document.querySelectorAll('.variable-input').forEach(function (varInput) {
      const cid = varInput.dataset.commandId;
      const vname = varInput.dataset.variableName;
      if (cid && vname) {
        const d = getCommandDraft(cid);
        d[vname] = varInput.value;
        uiState.commandDrafts[cid] = d;
      }
    });

    // Read toggle states from DOM before re-render
    document.querySelectorAll('.variable-remember-toggle').forEach(function (container) {
      const cid = container.dataset.commandId;
      const vname = container.dataset.variableName;
      const activeBtn = container.querySelector('.toggle-option-3.active');
      if (cid && vname && activeBtn) {
        const rm = getCommandRemember(cid);
        rm[vname] = activeBtn.dataset.value;
        uiState.commandRemember[cid] = rm;
      }
    });

    const savedCommandId = command.id;
    const returnTab = uiState.editSourceTab || 'commands';
    uiState.editingCommandId = null;
    uiState.editCommandDraft = {title: '', template: '', description: '', groupId: ''};
    uiState.editSourceTab = null;
    uiState.activeTab = returnTab;
    uiState.pendingScrollCommandId = savedCommandId;
    persistDataThenRender('Command updated and saved.');
    persistCommandVariables();
  });

  const cancelEditButton = document.getElementById('btn-cancel-edit-command');
  if (cancelEditButton) {
    cancelEditButton.addEventListener('click', function () {
      const savedCommandId = command.id;
      const returnTab = uiState.editSourceTab || 'commands';
      uiState.editingCommandId = null;
      uiState.editCommandDraft = {title: '', template: '', description: '', groupId: ''};
      uiState.editSourceTab = null;
      uiState.activeTab = returnTab;
      uiState.pendingScrollCommandId = savedCommandId;
      render();
    });
  }

  const editCommandTitleInput = document.getElementById('edit-command-title');
  const editCommandTemplateInput = document.getElementById('edit-command-template');
  const editCommandDescriptionInput = document.getElementById('edit-command-description');

  if (editCommandTitleInput) {
    editCommandTitleInput.addEventListener('input', function () {
      uiState.editCommandDraft.title = editCommandTitleInput.value;
    });
  }

  if (editCommandTemplateInput) {
    editCommandTemplateInput.addEventListener('input', function () {
      uiState.editCommandDraft.template = editCommandTemplateInput.value;
      // Preserve cursor position before re-render (to update variables section)
      const cursorStart = editCommandTemplateInput.selectionStart;
      const cursorEnd = editCommandTemplateInput.selectionEnd;
      render();
      // Restore focus and cursor after re-render
      const restored = document.getElementById('edit-command-template');
      if (restored) {
        restored.focus();
        restored.setSelectionRange(cursorStart, cursorEnd);
      }
    });
  }

  if (editCommandDescriptionInput) {
    editCommandDescriptionInput.addEventListener('input', function () {
      uiState.editCommandDraft.description = editCommandDescriptionInput.value;
    });
  }

  document.querySelectorAll('.edit-command-group-tag').forEach(function (tabButton) {
    tabButton.addEventListener('click', function () {
      const groupId = tabButton.dataset.groupId;
      uiState.editCommandDraft.groupId = uiState.editCommandDraft.groupId === groupId ? '' : groupId;
      render();
    });
  });

  document.querySelectorAll('.variable-input').forEach(function (input) {
    input.addEventListener('input', function () {
      const commandId = input.dataset.commandId;
      const variableName = input.dataset.variableName;
      const draft = getCommandDraft(commandId);
      draft[variableName] = input.value;
      uiState.commandDrafts[commandId] = draft;
      // No auto-save here — save happens on form submit
    });
  });

  // Bind category selector in edit tab (custom select)
  bindCustomSelect(
    'edit-category-select-wrap',
    'edit-category-select-btn',
    'edit-category-select-menu',
    function (newCategoryId) {
      uiState.editCommandDraft.targetCategoryId = newCategoryId;
      // If the user reverts to the original category, restore the original groupId
      if (newCategoryId === command.categoryId) {
        uiState.editCommandDraft.groupId = command.groupId || '';
      } else {
        uiState.editCommandDraft.groupId = ''; // reset group — it belongs to the new category
      }
      render();
    }
  );

  // Bind helpUrl input in edit tab
  const editHelpUrlInput = document.getElementById('edit-command-help-url');
  if (editHelpUrlInput) {
    editHelpUrlInput.addEventListener('input', function () {
      uiState.editCommandDraft.helpUrl = editHelpUrlInput.value;
    });
  }

  // Bind Enum Manager buttons in edit tab
  document.querySelectorAll('.btn-open-enum-manager').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const varName = btn.dataset.varName;
      const commandId = btn.dataset.commandId || null;

      let currentEnumValues = [];
      if (commandId === null || commandId === '') {
        const meta = uiState.newCommandDraft.variableMeta && uiState.newCommandDraft.variableMeta[varName];
        currentEnumValues = (meta && meta.type === 'enum' && meta.enumValues) ? meta.enumValues.map(function (e) {return Object.assign({}, e);}) : [];
      } else {
        const meta = uiState.editCommandDraft.variableMeta && uiState.editCommandDraft.variableMeta[varName];
        currentEnumValues = (meta && meta.type === 'enum' && meta.enumValues) ? meta.enumValues.map(function (e) {return Object.assign({}, e);}) : [];
      }

      enumManagerState = {
        visible: true,
        commandId: commandId === '' ? null : commandId,
        varName,
        enumValues: currentEnumValues,
        editIndex: null,
        editTitle: '',
        editValue: '',
        editDescription: '',
      };
      render();
    });
  });

  // Bind toggle switches in edit tab — update state only, no auto-save
  document.querySelectorAll('.variable-remember-toggle').forEach(function (container) {
    container.querySelectorAll('.toggle-option-3').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) {
          return;
        }

        container.querySelectorAll('.toggle-option-3').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        const commandId = container.dataset.commandId;
        const variableName = container.dataset.variableName;
        const value = btn.dataset.value;

        const rememberMap = getCommandRemember(commandId);
        rememberMap[variableName] = value;
        uiState.commandRemember[commandId] = rememberMap;
        // No auto-save here — save happens on form submit
      });
    });
  });
}

function syncNewCommandDraftFromDom() {
  const titleInput = document.getElementById('new-command-title');
  const templateInput = document.getElementById('new-command-template');
  const descriptionInput = document.getElementById('new-command-description');

  if (titleInput) {
    uiState.newCommandDraft.title = titleInput.value;
  }

  if (templateInput) {
    uiState.newCommandDraft.template = templateInput.value;
  }

  if (descriptionInput) {
    uiState.newCommandDraft.description = descriptionInput.value;
  }
}

function bindCommandActionButtons() {
  document.querySelectorAll('.btn-run').forEach(function (button) {
    button.addEventListener('click', function () {
      syncEditCommandDraftFromDom();
      const commandId = button.dataset.commandId;
      const command = (state.data.commands || []).find(function (item) {
        return item.id === commandId;
      });

      if (!command) {
        return;
      }

      const missing = getMissingVariables(command);

      if (missing.length > 0) {
        const autoVarNames = getEnabledAutoVariableNames();
        const allVars = collectVariables([command.command]).filter(function (name) {
          return !autoVarNames.includes(name);
        });
        const draft = getCommandDraft(commandId);
        const rememberMap = getCommandRemember(commandId);
        const inputValues = {};
        const rememberFlags = {};
        allVars.forEach(function (name) {
          inputValues[name] = draft[name] || '';
          rememberFlags[name] = rememberMap[name] || 'off';
        });
        variableInputState = {
          commandId,
          action: 'run',
          missingVariables: allVars,
          inputValues,
          rememberFlags,
          returnToRunConfirm: false,
        };
        render();
        return;
      }

      runConfirmState = {
        commandId,
        resolvedCommand: resolveCommandTemplate(command),
        selectedShellPath: runConfirmState.selectedShellPath,
        selectedShellName: runConfirmState.selectedShellName,
      };

      render();
    });
  });

  document.querySelectorAll('.btn-use').forEach(function (button) {
    button.addEventListener('click', function (e) {
      syncEditCommandDraftFromDom();
      performCommandAction(button.dataset.commandId, 'use', e.ctrlKey);
    });
  });

  document.querySelectorAll('.btn-copy').forEach(function (button) {
    button.addEventListener('click', function () {
      syncEditCommandDraftFromDom();
      performCommandAction(button.dataset.commandId, 'copy');
    });
  });

  document.querySelectorAll('.btn-edit').forEach(function (button) {
    button.addEventListener('click', function () {
      const commandId = button.dataset.commandId;
      const command = (state.data.commands || []).find(function (item) {
        return item.id === commandId;
      });

      // Save the tab we came from so we can return to it
      uiState.editSourceTab = uiState.activeTab;
      uiState.editingCommandId = commandId;

      if (command) {
        uiState.editCommandDraft = {
          title: command.title || '',
          template: command.command || '',
          description: command.description || '',
          groupId: command.groupId || '',
          helpUrl: command.helpUrl || '',
          variableMeta: command.variableMeta ? JSON.parse(JSON.stringify(command.variableMeta)) : {},
          targetCategoryId: command.categoryId || '',
        };
      }

      // Do NOT change activeTab — keep it as-is, tabs will show no active selection
      render();
    });
  });

  document.querySelectorAll('.btn-delete-command').forEach(function (button) {
    button.addEventListener('click', function () {
      const commandId = button.dataset.commandId;
      const command = (state.data.commands || []).find(function (item) {
        return item.id === commandId;
      });

      deleteConfirmState = {
        type: 'command',
        id: commandId,
        title: command ? command.title : commandId,
        template: command ? command.command : '',
      };
      render();
    });
  });

  // --- Add to Favorites buttons (in Commands and Recent tabs) ---
  // Modifier shortcuts (left-click):
  //   Ctrl+Click           → Add to Global
  //   Shift+Click          → Add to Local  (workspace required)
  //   Ctrl+Shift+Click     → Add to Both
  //   Plain click          → Open manage modal
  // Modifier shortcuts (right-click / contextmenu):
  //   Ctrl+Right           → Remove from Global
  //   Shift+Right          → Remove from Local  (workspace required)
  //   Ctrl+Shift+Right     → Remove from Both
  document.querySelectorAll('.btn-add-favorite').forEach(function (button) {

    // ── Left-click ────────────────────────────────────────────────────────────
    button.addEventListener('click', function (e) {
      const commandId = button.dataset.commandId;
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const hasWorkspace = !!state.workspaceFolder;

      if (ctrlOrMeta && shift) {
        // Ctrl+Shift+Click → Add to Both
        const newGlobal = state.globalFavorites.includes(commandId)
          ? state.globalFavorites
          : state.globalFavorites.concat([commandId]);
        const newLocal = hasWorkspace
          ? (state.localFavorites.includes(commandId)
            ? state.localFavorites
            : state.localFavorites.concat([commandId]))
          : state.localFavorites;
        state.globalFavorites = newGlobal;
        state.localFavorites = newLocal;
        persistFavorites({global: newGlobal, local: newLocal});
        showNotice(hasWorkspace ? 'Added to Global & Local Favorites.' : 'Added to Global Favorites. (No workspace for local)', iconHeartPlus(), 'success');
        render();
      } else if (ctrlOrMeta) {
        // Ctrl+Click → Add to Global
        const newGlobal = state.globalFavorites.includes(commandId)
          ? state.globalFavorites
          : state.globalFavorites.concat([commandId]);
        state.globalFavorites = newGlobal;
        persistFavorites({global: newGlobal, local: state.localFavorites});
        showNotice('Added to Global Favorites.', iconHeartPlus(), 'success');
        render();
      } else if (shift) {
        // Shift+Click → Add to Local (requires workspace)
        if (!hasWorkspace) {
          showNotice('Local favorites require an open workspace.', iconExclamationTriangle(), 'warning');
          paintNotice();
          return;
        }
        const newLocal = state.localFavorites.includes(commandId)
          ? state.localFavorites
          : state.localFavorites.concat([commandId]);
        state.localFavorites = newLocal;
        persistFavorites({global: state.globalFavorites, local: newLocal});
        showNotice('Added to Local Favorites.', iconHeartPlus(), 'success');
        render();
      } else {
        // Plain click → Open unified manage modal
        favoriteModalState = {
          visible: true,
          commandId,
          selectedLocal: state.localFavorites.includes(commandId),
          selectedGlobal: state.globalFavorites.includes(commandId),
        };
        render();
      }
    });

    // ── Right-click (contextmenu) — modifier key required ─────────────────────
    button.addEventListener('contextmenu', function (e) {
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // Only intercept when a modifier is held; otherwise let global handler handle it
      if (!ctrlOrMeta && !shift) {return;}

      e.preventDefault();
      e.stopPropagation();

      const commandId = button.dataset.commandId;
      const hasWorkspace = !!state.workspaceFolder;

      if (ctrlOrMeta && shift) {
        // Ctrl+Shift+Right → Remove from Both
        const newGlobal = state.globalFavorites.filter(function (id) {return id !== commandId;});
        const newLocal = state.localFavorites.filter(function (id) {return id !== commandId;});
        state.globalFavorites = newGlobal;
        state.localFavorites = newLocal;
        persistFavorites({global: newGlobal, local: newLocal});
        showNotice('Removed from Global & Local Favorites.', iconHeartMinus(), 'info');
        render();
      } else if (ctrlOrMeta) {
        // Ctrl+Right → Remove from Global
        if (state.globalFavorites.includes(commandId)) {
          const newGlobal = state.globalFavorites.filter(function (id) {return id !== commandId;});
          state.globalFavorites = newGlobal;
          persistFavorites({global: newGlobal, local: state.localFavorites});
          showNotice('Removed from Global Favorites.', iconHeartMinus(), 'info');
          render();
        }
      } else if (shift) {
        // Shift+Right → Remove from Local (requires workspace)
        if (!hasWorkspace) {
          showNotice('Local favorites require an open workspace.', iconExclamationTriangle(), 'warning');
          paintNotice();
          return;
        }
        if (state.localFavorites.includes(commandId)) {
          const newLocal = state.localFavorites.filter(function (id) {return id !== commandId;});
          state.localFavorites = newLocal;
          persistFavorites({global: state.globalFavorites, local: newLocal});
          showNotice('Removed from Local Favorites.', iconHeartMinus(), 'info');
          render();
        }
      }
    });
  });

  // Bind favorite modal events if modal is visible (from Commands/Recent tab)
  if (favoriteModalState.visible) {
    bindFavoriteModalEvents();
  }

  const confirmRunYesButton = document.getElementById('btn-confirm-run-yes');
  const confirmRunNoButton = document.getElementById('btn-confirm-run-no');
  const confirmRunVariablesButton = document.getElementById('btn-confirm-run-variables');

  // --- Shell selector dropdown ---
  const shellSelectorWrap = document.getElementById('shell-selector-wrap');
  const shellSelectorBtn = document.getElementById('shell-selector-btn');
  const shellSelectorMenu = document.getElementById('shell-selector-menu');

  if (shellSelectorBtn && shellSelectorMenu) {
    function closeShellMenu() {
      if (!shellSelectorMenu.hidden) {
        shellSelectorMenu.hidden = true;
        shellSelectorBtn.setAttribute('aria-expanded', 'false');
      }
      document.removeEventListener('pointerdown', onShellPointerDown, true);
    }

    function onShellPointerDown(e) {
      if (shellSelectorWrap && !shellSelectorWrap.contains(e.target)) {
        closeShellMenu();
      }
    }

    shellSelectorBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = !shellSelectorMenu.hidden;
      if (isOpen) {
        closeShellMenu();
      } else {
        shellSelectorMenu.hidden = false;
        shellSelectorBtn.setAttribute('aria-expanded', 'true');
        document.addEventListener('pointerdown', onShellPointerDown, true);
      }
    });

    shellSelectorMenu.querySelectorAll('.cs-item').forEach(function (item) {
      item.addEventListener('click', function () {
        runConfirmState.selectedShellName = item.dataset.shellName || null;
        runConfirmState.selectedShellPath = item.dataset.shellPath || null;
        closeShellMenu();
        render();
      });

      item.addEventListener('mouseenter', function () {
        item.setAttribute('data-highlighted', '');
      });
      item.addEventListener('mouseleave', function () {
        item.removeAttribute('data-highlighted');
      });
    });
  }

  if (confirmRunYesButton) {
    confirmRunYesButton.addEventListener('click', function () {
      const commandId = runConfirmState.commandId;
      const shellPath = runConfirmState.selectedShellPath || null;
      const shellName = runConfirmState.selectedShellName || null;
      runConfirmState = {commandId: null, resolvedCommand: '', selectedShellPath: shellPath, selectedShellName: shellName};
      render();

      if (!commandId) {
        return;
      }

      dispatchCommandAction(commandId, 'run', shellPath, shellName);
    });
  }

  if (confirmRunNoButton) {
    confirmRunNoButton.addEventListener('click', function () {
      runConfirmState = {commandId: null, resolvedCommand: '', selectedShellPath: runConfirmState.selectedShellPath, selectedShellName: runConfirmState.selectedShellName};
      render();
    });
  }

  if (confirmRunVariablesButton) {
    confirmRunVariablesButton.addEventListener('click', function () {
      const commandId = runConfirmState.commandId;

      if (!commandId) {
        return;
      }

      const command = (state.data.commands || []).find(function (item) {
        return item.id === commandId;
      });

      if (!command) {
        return;
      }

      const autoVarNamesRunVars = getEnabledAutoVariableNames();
      const allVars = collectVariables([command.command]).filter(function (name) {
        return !autoVarNamesRunVars.includes(name);
      });

      const draft = getCommandDraft(commandId);
      const rememberMap = getCommandRemember(commandId);
      const inputValues = {};
      const rememberFlags = {};

      allVars.forEach(function (name) {
        inputValues[name] = draft[name] || '';
        rememberFlags[name] = rememberMap[name] || 'off';
      });

      variableInputState = {
        commandId,
        action: 'run',
        missingVariables: allVars,
        inputValues,
        rememberFlags,
        returnToRunConfirm: true,
      };

      render();
    });
  }

  // Bind custom selects for enum variables in variable input modal
  document.querySelectorAll('.enum-input-wrap[data-variable-name]').forEach(function (wrapEl) {
    const varName = wrapEl.dataset.variableName;
    if (!varName) {return;}
    bindCustomSelect(
      'enum-var-wrap-' + varName,
      'enum-var-btn-' + varName,
      'enum-var-menu-' + varName,
      function (selectedValue) {
        const customInput = wrapEl.querySelector('.variable-modal-custom-input');
        if (selectedValue === '__custom__') {
          if (customInput) {
            customInput.classList.remove('hidden');
            customInput.focus();
          }
        } else {
          if (customInput) {
            customInput.classList.add('hidden');
            customInput.value = selectedValue;
          }
          variableInputState.inputValues[varName] = selectedValue;
        }
      }
    );
  });

  // Bind toggle switches in variable input modal
  document.querySelectorAll('.variable-modal-remember-toggle').forEach(function (container) {
    container.querySelectorAll('.toggle-option-3').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.disabled) {
          return;
        }

        container.querySelectorAll('.toggle-option-3').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        const varName = container.dataset.variableName;
        variableInputState.rememberFlags[varName] = btn.dataset.value;
      });
    });
  });

  var variableInputConfirmButton = document.getElementById('btn-variable-input-confirm');
  var variableInputCancelButton = document.getElementById('btn-variable-input-cancel');

  if (variableInputConfirmButton) {
    variableInputConfirmButton.addEventListener('click', function () {
      const commandId = variableInputState.commandId;
      const action = variableInputState.action;
      const returnToRunConfirm = variableInputState.returnToRunConfirm;

      if (!commandId || !action) {
        variableInputState = {commandId: null, action: null, missingVariables: [], inputValues: {}, rememberFlags: {}, returnToRunConfirm: false};
        render();
        return;
      }

      // Collect current values from the modal DOM
      document.querySelectorAll('.variable-modal-input').forEach(function (input) {
        const varName = input.dataset.variableName;
        variableInputState.inputValues[varName] = input.value;
      });

      // Collect remember flags from toggle switches in the modal DOM
      document.querySelectorAll('.variable-modal-remember-toggle').forEach(function (container) {
        const varName = container.dataset.variableName;
        const activeBtn = container.querySelector('.toggle-option-3.active');
        variableInputState.rememberFlags[varName] = activeBtn ? activeBtn.dataset.value : 'off';
      });

      // Apply input values to commandDraft
      const draft = getCommandDraft(commandId);
      Object.keys(variableInputState.inputValues).forEach(function (varName) {
        draft[varName] = variableInputState.inputValues[varName];
      });
      uiState.commandDrafts[commandId] = draft;

      // Apply remember flags
      const rememberMap = getCommandRemember(commandId);
      Object.keys(variableInputState.rememberFlags).forEach(function (varName) {
        rememberMap[varName] = variableInputState.rememberFlags[varName];
      });
      uiState.commandRemember[commandId] = rememberMap;

      // Persist if any flag is not 'off'
      const hasToSave = Object.values(variableInputState.rememberFlags).some(function (v) {
        return v !== 'off';
      });
      if (hasToSave) {
        persistCommandVariables();
      }

      // Close variable input modal
      variableInputState = {commandId: null, action: null, missingVariables: [], inputValues: {}, rememberFlags: {}, returnToRunConfirm: false};

      if (action === 'run') {
        const command = (state.data.commands || []).find(function (item) {
          return item.id === commandId;
        });

        if (command) {
          runConfirmState = {
            commandId,
            resolvedCommand: resolveCommandTemplate(command),
            selectedShellPath: runConfirmState.selectedShellPath,
            selectedShellName: runConfirmState.selectedShellName,
          };
        }

        render();
        return;
      }

      render();
      dispatchCommandAction(commandId, action, null, null);
    });
  }

  if (variableInputCancelButton) {
    variableInputCancelButton.addEventListener('click', function () {
      const returnToRunConfirm = variableInputState.returnToRunConfirm;
      variableInputState = {commandId: null, action: null, missingVariables: [], inputValues: {}, rememberFlags: {}, returnToRunConfirm: false};

      if (!returnToRunConfirm) {
        runConfirmState = {commandId: null, resolvedCommand: '', selectedShellPath: runConfirmState.selectedShellPath, selectedShellName: runConfirmState.selectedShellName};
      }

      render();
    });
  }

  var confirmDeleteYesButton = document.getElementById('btn-confirm-delete-yes');
  var confirmDeleteNoButton = document.getElementById('btn-confirm-delete-no');

  if (confirmDeleteYesButton) {
    confirmDeleteYesButton.addEventListener('click', function () {
      executeDeleteConfirm();
    });
  }

  if (confirmDeleteNoButton) {
    confirmDeleteNoButton.addEventListener('click', function () {
      deleteConfirmState = {type: null, id: null, title: '', template: ''};
      render();
    });
  }
}

/** Execute the pending delete action based on deleteConfirmState */
function executeDeleteConfirm() {
  var type = deleteConfirmState.type;
  var id = deleteConfirmState.id;

  deleteConfirmState = {type: null, id: null, title: '', template: ''};

  if (type === 'clearRecent') {
    (state.data.commands || []).forEach(function (cmd) {
      delete cmd.lastRunAt;
      delete cmd.runCount;
    });
    persistDataThenRender('Recent history cleared.');
    return;
  }

  if (type === 'category') {
    state.data.categories = (state.data.categories || []).filter(function (category) {
      return category.id !== id;
    });

    state.data.commands = (state.data.commands || []).filter(function (command) {
      return command.categoryId !== id;
    });

    if (uiState.selectedCategoryId === id) {
      uiState.selectedCategoryId = '';
      uiState.selectedGroupId = 'all';
    }

    if (uiState.editingCommandId) {
      var editCmd = (state.data.commands || []).find(function (c) {
        return c.id === uiState.editingCommandId;
      });

      if (!editCmd) {
        uiState.editingCommandId = null;
        uiState.editCommandDraft = {title: '', template: '', description: '', groupId: ''};
      }
    }

    persistDataThenRender('Category deleted and saved.');
    return;
  }

  if (type === 'group') {
    var selectedCategory = getSelectedCategory();

    if (selectedCategory) {
      selectedCategory.groups = (selectedCategory.groups || []).filter(function (group) {
        return group.id !== id;
      });

      (state.data.commands || []).forEach(function (command) {
        if (command.categoryId === selectedCategory.id && command.groupId === id) {
          command.groupId = '';
        }
      });
    }

    if (uiState.selectedGroupId === id) {
      uiState.selectedGroupId = 'all';
    }

    persistDataThenRender('Group deleted and saved.');
    return;
  }

  if (type === 'command') {
    state.data.commands = (state.data.commands || []).filter(function (command) {
      return command.id !== id;
    });

    delete uiState.commandDrafts[id];
    delete uiState.commandRemember[id];

    if (state.commandVariables.commands && Object.prototype.hasOwnProperty.call(state.commandVariables.commands, id)) {
      delete state.commandVariables.commands[id];
    }

    if (state.globalCommandVariables && state.globalCommandVariables.commands && Object.prototype.hasOwnProperty.call(state.globalCommandVariables.commands, id)) {
      delete state.globalCommandVariables.commands[id];
    }

    if (uiState.editingCommandId === id) {
      uiState.editingCommandId = null;
      uiState.editCommandDraft = {title: '', template: '', description: '', groupId: ''};
      runConfirmState = {commandId: null, resolvedCommand: '', selectedShellPath: runConfirmState.selectedShellPath, selectedShellName: runConfirmState.selectedShellName};
      uiState.activeTab = 'commands';
    }

    persistDataThenRender('Command deleted and saved.');
    return;
  }
}

function persistDataThenRender(successMessage) {
  showNotice(successMessage, IconCircleCheck(), 'success');
  render();
  vscode.postMessage({type: 'saveData', payload: state.data});
}

function persistCommandVariables() {
  const payload = buildCommandVariablesPayload();
  vscode.postMessage({type: 'saveCommandVariables', payload});
}

function syncEditCommandDraftFromDom() {
  if (!uiState.editingCommandId) {
    return;
  }

  const titleInput = document.getElementById('edit-command-title');
  const descriptionInput = document.getElementById('edit-command-description');
  const templateInput = document.getElementById('edit-command-template');
  const helpUrlInput = document.getElementById('edit-command-help-url');

  if (!titleInput || !templateInput) {
    return;
  }

  uiState.editCommandDraft.title = titleInput.value;
  uiState.editCommandDraft.description = descriptionInput ? descriptionInput.value : '';
  uiState.editCommandDraft.template = templateInput.value;
  if (helpUrlInput) {
    uiState.editCommandDraft.helpUrl = helpUrlInput.value;
  }
}

function syncEditCommandDraftFromCommand(command) {
  if (!command || uiState.editingCommandId !== command.id) {
    return;
  }

  if (!uiState.editCommandDraft.title && !uiState.editCommandDraft.template && !uiState.editCommandDraft.description && !uiState.editCommandDraft.groupId) {
    uiState.editCommandDraft = {
      title: command.title || '',
      template: command.command || '',
      description: command.description || '',
      groupId: command.groupId || '',
      helpUrl: command.helpUrl || '',
      variableMeta: command.variableMeta ? JSON.parse(JSON.stringify(command.variableMeta)) : {},
      targetCategoryId: command.categoryId || '',
    };
  }
}

function showNotice(message, icon, type) {
  noticeIsError = false;
  uiState.noticeMessage = message;
  uiState.noticeIcon = icon !== undefined ? icon : IconCircleExclamation();
  uiState.noticeType = type || 'info';

  if (noticeTimer) {
    clearTimeout(noticeTimer);
  }

  noticeTimer = setTimeout(function () {
    uiState.noticeMessage = '';
    uiState.noticeIcon = '';
    uiState.noticeType = '';
    noticeIsError = false;
    // Remove the notice element directly — no full re-render needed
    var noticeEl = document.querySelector('.notice');
    if (noticeEl) {noticeEl.remove();}
    noticeTimer = null;
  }, 3000);
}

function showError(message, icon, type) {
  noticeIsError = true;
  uiState.noticeMessage = message;
  uiState.noticeIcon = icon !== undefined ? icon : IconCircleX();
  uiState.noticeType = type || 'error';

  if (noticeTimer) {
    clearTimeout(noticeTimer);
  }

  noticeTimer = setTimeout(function () {
    uiState.noticeMessage = '';
    uiState.noticeIcon = '';
    uiState.noticeType = '';
    noticeIsError = false;
    // Remove the notice element directly — no full re-render needed
    var noticeEl = document.querySelector('.notice');
    if (noticeEl) {noticeEl.remove();}
    noticeTimer = null;
  }, 4000);
}

/**
 * Inserts or updates the notice element in the DOM directly,
 * without triggering a full page re-render.
 * Call this after showNotice() / showError() when a full render is not needed.
 */
function paintNotice() {
  var layout = document.querySelector('.layout');
  if (!layout) {return;}
  // Remove any existing notice
  var existing = layout.querySelector('.notice');
  if (existing) {existing.remove();}
  if (!uiState.noticeMessage) {return;}
  var el = document.createElement('div');
  el.className = 'notice' + (uiState.noticeType ? ' notice-' + uiState.noticeType : '');
  el.innerHTML = '<div class="notice-icon">' + uiState.noticeIcon + '</div><div class="notice-message">' + uiState.noticeMessage + '</div>';
  // Insert after workspace-label (2nd child), before the tabs section
  var workspaceLabel = layout.querySelector('.workspace-label');
  if (workspaceLabel && workspaceLabel.nextSibling) {
    layout.insertBefore(el, workspaceLabel.nextSibling);
  } else {
    layout.appendChild(el);
  }
}

/**
 * Returns a list of currently enabled auto variable names.
 * Used to exclude these variables from input prompts.
 * @returns {string[]}
 */
function getEnabledAutoVariableNames() {
  return (state.autoVariables || [])
    .filter(function (v) {
      return v.enabled;
    })
    .map(function (v) {
      return v.name;
    });
}

function getMissingVariables(command) {
  const names = collectVariables([command.command]);
  const draft = getCommandDraft(command.id);
  const autoVarNames = getEnabledAutoVariableNames();

  return names.filter(function (name) {
    if (autoVarNames.includes(name)) {
      return false;
    }

    return !draft[name];
  });
}

function performCommandAction(commandId, action, forceShowVariables) {
  const command = (state.data.commands || []).find(function (item) {
    return item.id === commandId;
  });

  if (!command) {
    return;
  }

  const autoVarNames = getEnabledAutoVariableNames();
  const allVars = collectVariables([command.command]).filter(function (name) {
    return !autoVarNames.includes(name);
  });
  const hasVariables = allVars.length > 0;

  // If CTRL is held and the command has variables → force open the variable input modal
  if (forceShowVariables && hasVariables) {
    const draft = getCommandDraft(commandId);
    const rememberMap = getCommandRemember(commandId);
    const inputValues = {};
    const rememberFlags = {};
    allVars.forEach(function (name) {
      inputValues[name] = draft[name] || '';
      rememberFlags[name] = rememberMap[name] || 'off';
    });
    variableInputState = {
      commandId,
      action,
      missingVariables: allVars,
      inputValues,
      rememberFlags,
      returnToRunConfirm: false,
    };
    render();
    return;
  }

  // Default behavior: open modal only if there are missing variables
  const missing = getMissingVariables(command);

  if (missing.length > 0) {
    const draft = getCommandDraft(commandId);
    const rememberMap = getCommandRemember(commandId);
    const inputValues = {};
    const rememberFlags = {};
    allVars.forEach(function (name) {
      inputValues[name] = draft[name] || '';
      rememberFlags[name] = rememberMap[name] || 'off';
    });
    variableInputState = {
      commandId,
      action,
      missingVariables: allVars,
      inputValues,
      rememberFlags,
      returnToRunConfirm: false,
    };
    render();
    return;
  }

  dispatchCommandAction(commandId, action);
}

function dispatchCommandAction(commandId, action, shellPath, shellName) {
  const command = (state.data.commands || []).find(function (item) {
    return item.id === commandId;
  });

  if (!command) {
    return;
  }

  const resolved = resolveCommandTemplate(command);
  const commandVariables = buildCommandVariablesPayload();

  vscode.postMessage({
    type: 'performAction',
    payload: {
      action,
      commandId,
      resolvedCommand: resolved,
      commandVariables,
      ...(shellPath ? {shellPath} : {}),
      ...(shellName ? {shellName} : {}),
    },
  });
}

function resolveCommandTemplate(command) {
  const names = collectVariables([command.command]);
  let resolved = command.command;
  const draft = getCommandDraft(command.id);
  const autoVarNames = getEnabledAutoVariableNames();

  names.forEach(function (name) {
    // Auto variables: use currentValue from state.autoVariables for preview
    if (autoVarNames.includes(name)) {
      const autoVarDef = (state.autoVariables || []).find(function (v) {
        return v.name === name;
      });
      const value = autoVarDef ? (autoVarDef.currentValue || '') : '';
      resolved = resolved.replace(new RegExp('\\$\\{' + escapeRegExp(name) + '\\}', 'g'), value);
      return;
    }
    // Regular variables: from user draft
    const value = draft[name] || '';
    resolved = resolved.replace(new RegExp('\\$\\{' + escapeRegExp(name) + '\\}', 'g'), value);
  });

  return resolved;
}

function buildCommandVariablesPayload() {
  const local = {version: 2, commands: {}};
  const global = {version: 2, commands: {}};

  Object.keys(uiState.commandRemember).forEach(function (commandId) {
    const rememberMap = uiState.commandRemember[commandId] || {};
    const draft = getCommandDraft(commandId);
    const localVars = {};
    const globalVars = {};

    Object.keys(rememberMap).forEach(function (variableName) {
      if (variableName === 'workspaceFolder') {
        return;
      }

      const flag = rememberMap[variableName];
      const val = draft[variableName];

      if (flag === 'local' && val) {
        localVars[variableName] = val;
      } else if (flag === 'global' && val) {
        globalVars[variableName] = val;
      }
    });

    if (Object.keys(localVars).length > 0) {
      local.commands[commandId] = localVars;
    }

    if (Object.keys(globalVars).length > 0) {
      global.commands[commandId] = globalVars;
    }
  });

  return {local, global};
}

function getCommandDraft(commandId) {
  if (!uiState.commandDrafts[commandId]) {
    const globalVars = (state.globalCommandVariables && state.globalCommandVariables.commands && state.globalCommandVariables.commands[commandId]) || {};
    const localVars = (state.commandVariables && state.commandVariables.commands && state.commandVariables.commands[commandId]) || {};
    uiState.commandDrafts[commandId] = {...globalVars, ...localVars};
  }

  return uiState.commandDrafts[commandId];
}

function getCommandRemember(commandId) {
  if (!uiState.commandRemember[commandId]) {
    const remembered = {};
    const globalVars = (state.globalCommandVariables && state.globalCommandVariables.commands && state.globalCommandVariables.commands[commandId]) || {};
    const localVars = (state.commandVariables && state.commandVariables.commands && state.commandVariables.commands[commandId]) || {};

    Object.keys(globalVars).forEach(function (key) {
      remembered[key] = 'global';
    });

    Object.keys(localVars).forEach(function (key) {
      remembered[key] = 'local';
    });

    uiState.commandRemember[commandId] = remembered;
  }

  return uiState.commandRemember[commandId];
}

function collectVariables(commandTemplates) {
  const names = new Set();
  const regex = /\$\{([a-zA-Z0-9_]+)\}/g;

  commandTemplates.forEach(function (template) {
    if (typeof template !== 'string') {
      return;
    }

    let match = regex.exec(template);

    while (match) {
      names.add(match[1]);
      match = regex.exec(template);
    }

    regex.lastIndex = 0;
  });

  return Array.from(names.values());
}

function resolveGroupTitle(groupId, groups) {
  if (!groupId) {
    return '-';
  }

  const group = groups.find(function (item) {
    return item.id === groupId;
  });

  return group ? group.title : groupId;
}

function generateEntityId(prefix) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Enum Manager & Help Link Functions ──────────────────────────────────────

/**
 * Renders the Enum Manager modal for a specific variable.
 */
function renderEnumManagerModal() {
  const s = enumManagerState;
  const values = s.enumValues || [];

  const rowsHtml = values.map(function (item, idx) {
    return `
      <tr class="enum-row" data-idx="${idx}">
        <td class="enum-cell-title">${escapeHtml(item.title)}</td>
        <td class="enum-cell-value"><code>${escapeHtml(item.value)}</code></td>
        <td class="enum-cell-desc">${escapeHtml(item.description)}</td>
        <td class="enum-cell-actions">
          <div>
            <button type="button" class="btn icon-btn small secondary btn-enum-edit" data-idx="${idx}" data-tooltip="Edit enum value">${iconEdit()}</button>
            <button type="button" class="btn icon-btn small danger btn-enum-delete" data-idx="${idx}" data-tooltip="Delete enum value">${iconDelete()}</button>
          </div>
        </td>
      </tr>
          `;
  }).join('');


  const editFormHtml = `
    <div class="enum-add-form">
      <h4>${s.editIndex !== null ? 'Edit Enum Value' : 'Add Enum Value'}</h4>
      <div class="enum-form-grid">
        <label>Title<input id="enum-input-title" class="input" placeholder="e.g. Silent" value="${escapeAttr(s.editTitle)}" autocomplete="off" /></label>
        <label>Value<input id="enum-input-value" class="input" placeholder="e.g. silent" value="${escapeAttr(s.editValue)}" autocomplete="off" /></label>
        <label class="enum-form-desc">Description<input id="enum-input-desc" class="input" placeholder="What this option does..." value="${escapeAttr(s.editDescription)}" autocomplete="off" /></label>
      </div>
      <div class="row justify-content-flex-end">
        <button type="button" class="btn small primary" id="btn-enum-add-confirm">${s.editIndex !== null ? 'Update' : '+ Add'}</button>
        ${s.editIndex !== null ? '<button type="button" class="btn small secondary action" id="btn-enum-edit-cancel">Cancel Edit</button>' : ''}
      </div>
    </div>
  `;

  return `
    <div class="modal-overlay" id="enum-manager-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box enum-manager-box">
        <div class="row between">
          <h3>Enum Values for <code>\${${escapeHtml(s.varName)}}</code></h3>
        </div>
        ${values.length > 0 ? `
        <div class="table-wrap">
          <div class="enum-table-scroll">
            <table class="enum-table">
              <thead><tr>
                <th>Title</th><th>Value</th><th>Description</th><th></th>
              </tr></thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        </div>` : `<p class="muted muted-no-margin">No enum values yet. Add one below.</p>`}
        ${editFormHtml}
        <div class="row justify-content-flex-end mt-20">
          <button class="btn medium primary min-w65" id="btn-enum-manager-save">Save</button>
          <button class="btn medium secondary action min-w65" id="btn-enum-manager-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Binds events for the Enum Manager modal.
 */
function bindEnumManagerEvents() {
  // --- Add / Update enum value ---
  const confirmBtn = document.getElementById('btn-enum-add-confirm');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      const titleInput = document.getElementById('enum-input-title');
      const valueInput = document.getElementById('enum-input-value');
      const descInput = document.getElementById('enum-input-desc');

      const title = titleInput ? titleInput.value.trim() : '';
      const value = valueInput ? valueInput.value.trim() : '';
      const description = descInput ? descInput.value.trim() : '';

      if (!title || !value) {
        showNotice('Title and Value are required.', iconExclamationTriangle(), 'warning');
        return;
      }

      if (enumManagerState.editIndex !== null) {
        enumManagerState.enumValues[enumManagerState.editIndex] = {title, value, description};
        enumManagerState.editIndex = null;
        enumManagerState.editTitle = '';
        enumManagerState.editValue = '';
        enumManagerState.editDescription = '';
      } else {
        enumManagerState.enumValues.push({title, value, description});
        enumManagerState.editTitle = '';
        enumManagerState.editValue = '';
        enumManagerState.editDescription = '';
      }

      render();
    });
  }

  // --- Cancel edit ---
  const cancelEditBtn = document.getElementById('btn-enum-edit-cancel');
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', function () {
      enumManagerState.editIndex = null;
      enumManagerState.editTitle = '';
      enumManagerState.editValue = '';
      enumManagerState.editDescription = '';
      render();
    });
  }

  // --- Edit row buttons ---
  document.querySelectorAll('.btn-enum-edit').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const idx = parseInt(btn.dataset.idx, 10);
      const item = enumManagerState.enumValues[idx];
      if (!item) {return;}
      enumManagerState.editIndex = idx;
      enumManagerState.editTitle = item.title;
      enumManagerState.editValue = item.value;
      enumManagerState.editDescription = item.description;
      render();
    });
  });

  // --- Delete row buttons ---
  document.querySelectorAll('.btn-enum-delete').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const idx = parseInt(btn.dataset.idx, 10);
      enumManagerState.enumValues.splice(idx, 1);
      if (enumManagerState.editIndex === idx) {
        enumManagerState.editIndex = null;
        enumManagerState.editTitle = '';
        enumManagerState.editValue = '';
        enumManagerState.editDescription = '';
      }
      render();
    });
  });

  // --- Save enum to command state ---
  const saveBtn = document.getElementById('btn-enum-manager-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      const varName = enumManagerState.varName;
      const commandId = enumManagerState.commandId;
      const enumValues = enumManagerState.enumValues.slice();

      // Apply to the correct draft's variableMeta
      if (commandId === null) {
        // New command context
        if (!uiState.newCommandDraft.variableMeta) {
          uiState.newCommandDraft.variableMeta = {};
        }
        if (enumValues.length > 0) {
          uiState.newCommandDraft.variableMeta[varName] = {type: 'enum', enumValues};
        } else {
          delete uiState.newCommandDraft.variableMeta[varName];
        }
      } else {
        // Edit command context — find command and update
        const command = (state.data.commands || []).find(function (c) {return c.id === commandId;});
        if (command) {
          if (!command.variableMeta) {
            command.variableMeta = {};
          }
          if (enumValues.length > 0) {
            command.variableMeta[varName] = {type: 'enum', enumValues};
          } else {
            delete command.variableMeta[varName];
            if (Object.keys(command.variableMeta).length === 0) {
              delete command.variableMeta;
            }
          }
        }
        // Also update editCommandDraft
        if (!uiState.editCommandDraft.variableMeta) {
          uiState.editCommandDraft.variableMeta = {};
        }
        if (enumValues.length > 0) {
          uiState.editCommandDraft.variableMeta[varName] = {type: 'enum', enumValues};
        } else {
          delete uiState.editCommandDraft.variableMeta[varName];
        }
      }

      enumManagerState = {
        visible: false, commandId: null, varName: '',
        enumValues: [], editIndex: null,
        editTitle: '', editValue: '', editDescription: '',
      };
      render();
    });
  }

  // --- Cancel ---
  const cancelBtn = document.getElementById('btn-enum-manager-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      enumManagerState = {
        visible: false, commandId: null, varName: '',
        enumValues: [], editIndex: null,
        editTitle: '', editValue: '', editDescription: '',
      };
      render();
    });
  }

  // --- Live input tracking ---
  const titleInput = document.getElementById('enum-input-title');
  const valueInput = document.getElementById('enum-input-value');
  const descInput = document.getElementById('enum-input-desc');

  if (titleInput) {
    titleInput.addEventListener('input', function () {
      enumManagerState.editTitle = titleInput.value;
    });
  }
  if (valueInput) {
    valueInput.addEventListener('input', function () {
      enumManagerState.editValue = valueInput.value;
    });
  }
  if (descInput) {
    descInput.addEventListener('input', function () {
      enumManagerState.editDescription = descInput.value;
    });
  }
}

/**
 * Binds click events on cmd-title-link elements (help links in tables).
 */
function bindCmdTitleLinks() {
  document.querySelectorAll('.cmd-title-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const url = link.dataset.url;
      if (url) {
        vscode.postMessage({type: 'openExternalUrl', payload: {url}});
      }
    });
  });
}

// ─── AI UI Render Functions ───────────────────────────────────────────────────

/**
 * Returns a display label for the AI provider and its associated model.
 * Uses dynamic data from aiState.aiProviderSetup (from providers-config.js) when available.
 * Falls back to hardcoded labels if setup data hasn't been loaded yet.
 * @param {string} providerName
 * @returns {string}
 */
function getAiModelLabel(providerName) {
  if (aiState.aiProviderSetup && aiState.aiProviderSetup[providerName]) {
    const cfg = aiState.aiProviderSetup[providerName];
    return `${cfg.serviceName} · ${cfg.modelLabel}`;
  }
  // Fallback labels (used before aiProviderSetup is loaded)
  const fallback = {
    gemini: 'Gemini · gemini-flash-latest',
    openai: 'OpenAI · gpt-4.1',
    anthropic: 'Anthropic · claude-sonnet-4-5',
  };
  return fallback[providerName] || providerName;
}

function renderAiSettingsModal() {
  // Build provider dropdown options dynamically from aiProviderSetup if available
  const providers = aiState.aiProviderSetup
    ? Object.values(aiState.aiProviderSetup).map(function (cfg) {
      return {value: cfg.name, label: cfg.displayLabel};
    })
    : [
      {value: 'gemini', label: 'Google Gemini (gemini-flash-latest)'},
      {value: 'openai', label: 'OpenAI ChatGPT (gpt-4.1)'},
      {value: 'anthropic', label: 'Anthropic Claude (claude-sonnet-4-5)'},
    ];

  const selectedProvider = aiState.settingsProviderName;
  const hasKey = aiState.keyStatus[selectedProvider];

  // Resolve provider setup info for links (if available)
  const providerSetup = aiState.aiProviderSetup && aiState.aiProviderSetup[selectedProvider];
  const apiKeyUrl = providerSetup ? providerSetup.apiKeyUrl : null;
  const apiKeyUrlLabel = providerSetup ? providerSetup.apiKeyUrlLabel : null;

  const providerLinksHtml = apiKeyUrl ? `
    <div class="ai-provider-links">    
      Don't have an API key?    
      <div class="ai-provider-help-item">
        ${iconKey()}
        <a class="ai-provider-link" id="btn-ai-get-api-key" data-url="${escapeAttr(apiKeyUrl)}" href="#" data-tooltip="Open ${escapeAttr(apiKeyUrlLabel || apiKeyUrl)} in browser">
          Get API Key (${escapeHtml(apiKeyUrlLabel || apiKeyUrl)})
        </a>
      </div>
      <div class="ai-provider-help-item">
        ${iconAiSetupHelp()}
        <a class="ai-provider-link ai-provider-link-help" id="btn-ai-show-setup-help" href="#" data-tooltip="Show step-by-step instructions">
          How to get (${escapeHtml(apiKeyUrlLabel || apiKeyUrl)}) API Key?
        </a>
      </div>
    </div>
  ` : '';

  return `
    <div class="modal-overlay" id="ai-settings-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box">
        <h3>${iconAISettings()} AI Settings</h3>
        <div class="d-grid gap-6">
          <span>AI Provider</span>
          ${renderCustomSelect(
    'ai-provider-select-wrap',
    'ai-provider-select-btn',
    'ai-provider-select-menu',
    providers,
    selectedProvider,
    'cs-btn-ai-provider', // btnExtraClass
    false, // menuUp
    'cs-wrap-full'
  )}
        </div>
        <label>
          <div>
            API Key for <strong>${escapeHtml(selectedProvider)}</strong>
          </div>          
        ${hasKey ? `
          <div class="ai-provider-key-status-item ai-key-ok">
            ${iconCheckboxOk()}
            <span class="ai-key-status ai-key-ok">Key saved</span>
          </div>
          ` : `
          <div class="ai-provider-key-status-item ai-key-missing">
            ${iconExclamationTriangle()}
            <span class="ai-key-status ai-key-missing">No key saved</span>
          </div>
        `}
          <input id="ai-api-key-input" class="input" type="password" placeholder="${hasKey ? 'Enter new key to update...' : 'Enter your API key...'}" value="${escapeAttr(aiState.apiKeyInput)}" autocomplete="off" />

          <div class="ai-SecretStorage-note">
            Using VS Code's native <code>SecretStorage</code>, your API key is securely encrypted and stored within your operating system's native credential manager (e.g., Windows Credential Manager, macOS Keychain, or Linux Secret Service). It is never saved as plain text in your local settings or workspace files.
          </div>




        </label>
        ${providerLinksHtml}
        <div class="row justify-content-flex-end mt-20">
          <button class="btn small primary min-w65" id="btn-ai-settings-save">Save</button>
          <button class="btn small secondary action min-w65" id="btn-ai-settings-cancel">Close</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the AI Provider Setup Help modal.
 * Shows step-by-step instructions for getting an API key for the selected provider.
 */
function renderAiProviderSetupModal() {
  const providerName = aiProviderSetupModalState.providerName;
  const setup = aiState.aiProviderSetup && providerName ? aiState.aiProviderSetup[providerName] : null;

  if (!setup) {
    return '';
  }

  const stepsHtml = setup.steps.map(function (step, idx) {
    return `<li class="ai-setup-step"><span class="ai-setup-step-num">${idx + 1}</span><span>${step}</span></li>`;
  }).join('');

  return `
    <div class="modal-overlay" id="ai-provider-setup-overlay" data-dismiss-on-outside-click="true">
      <div class="modal-box ai-setup-box">
        <h3>${iconKey()} How to get API Key for <strong>${escapeHtml(setup.serviceName)}</strong></h3>
        <ol class="ai-setup-steps">
          ${stepsHtml}
        </ol>
        <div class="ai-setup-footer">
          <a class="ai-provider-link" id="btn-ai-setup-open-url" data-url="${escapeAttr(setup.apiKeyUrl)}" href="#" data-tooltip="Open ${escapeAttr(setup.apiKeyUrlLabel)} in browser">
            ${iconExternalLink()}  Open ${escapeHtml(setup.apiKeyUrlLabel)}
          </a>
        </div>
        <div class="row justify-content-flex-end">
          <button class="btn small secondary action min-w65" id="btn-ai-setup-close">Close</button>
        </div>
      </div>
    </div>
  `;
}

function renderAiPromptModal() {
  const isFullMode = aiState.mode === 'full';
  const selectedCategory = getSelectedCategory();
  const groups = getSelectedCategoryGroups();
  const selectedGroup = groups.find(function (g) {return g.id === aiState.groupId;});
  const contextLabel = isFullMode
    ? `${iconSparkles()} Create a new category with all its groups and commands`
    : `${iconSparkles()} Add a single command to group: <code>${escapeHtml(selectedGroup ? selectedGroup.title : aiState.groupId)}</code> in <code>${escapeHtml(selectedCategory ? selectedCategory.title : aiState.categoryId)}</code>`;

  return `
    <div class="modal-overlay" id="ai-prompt-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box ai-prompt-box">
        <h3>${contextLabel}</h3>
        ${aiState.error ? `<p class="ai-error-msg">❌ ${escapeHtml(aiState.error)}</p>` : ''}
        <label>
          Describe what you need
          <textarea
            id="ai-prompt-textarea"
            class="input"
            rows="4"
            placeholder="${isFullMode ? 'e.g. All commands for CodeIgniter 4 framework' : 'e.g. A command to create a new CodeIgniter 4 model'}"
          >${escapeHtml(aiState.prompt)}</textarea>
        </label>
        <div class="row align-items-flex-end mt-20">
          <a href="#" class="muted ai-model-label" id="ai-model-label-link" data-url="${(aiState.aiProviderSetup && aiState.aiProviderSetup[aiState.providerName]) ? aiState.aiProviderSetup[aiState.providerName].apiKeyUrl : ''}" data-tooltip="View API model details">${iconExternalLink()} ${getAiModelLabel(aiState.providerName)}</a>
          <button class="btn small primary" id="btn-ai-generate">${iconSparkles()} Generate</button>
          <button class="btn small secondary action min-w65" id="btn-ai-prompt-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

function renderAiLoadingOverlay() {
  return `
    <div class="modal-overlay" id="ai-loading-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box ai-loading-box">
        <div class="ai-spinner" aria-label="Loading..."></div>
        <p class="ai-loading-text">Generating commands with AI...</p>
      </div>
    </div>
  `;
}

function renderAiResultsModal() {
  if (!aiState.result) {
    return '';
  }

  const isFullMode = aiState.mode === 'full';
  const allCommands = isFullMode ? (aiState.result.commands || []) : [aiState.result];
  const category = isFullMode ? aiState.result.category : null;
  const groups = isFullMode ? (aiState.result.category ? aiState.result.category.groups || [] : []) : getSelectedCategoryGroups();

  // Filter commands by active group tab
  const filteredCommands = aiState.filterGroupId === 'all'
    ? allCommands
    : allCommands.filter(function (cmd) {
      return cmd.groupId === aiState.filterGroupId;
    });

  const selectedCount = Object.values(aiState.checkedIds).filter(Boolean).length;

  // Build group tabs for filtering
  const groupTabs = isFullMode && groups.length > 0
    ? `
      <div class="group-tags-row">
        <button class="tag group-filter-tag ${aiState.filterGroupId === 'all' ? 'active' : ''}" data-ai-filter="all">All (${allCommands.length})</button>
        ${groups.map(function (g) {
      const count = allCommands.filter(function (cmd) {return cmd.groupId === g.id;}).length;
      return `<button class="tag group-filter-tag ${aiState.filterGroupId === g.id ? 'active' : ''}" data-ai-filter="${escapeAttr(g.id)}">${escapeHtml(g.title)} (${count})</button>`;
    }).join('')}
      </div>`
    : '';

  return `
    <div class="modal-overlay" id="ai-results-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box ai-results-box">
        <div class="row between">
          <h3>${iconSparkles()} AI Generated Commands</h3>
          ${isFullMode && category ? `<span class="muted ai-category-label">Category: <strong>${escapeHtml(category.title)}</strong></span>` : ''}
        </div>
        ${aiState.error ? `<p class="ai-error-msg">❌ ${escapeHtml(aiState.error)}</p>` : ''}
        ${groupTabs}
        <div class="table-wrap">
          <table class="cmds-table commands-table ai-results-table">
            <thead>
              <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Command</th>
              ${isFullMode ? '<th>Group</th>' : ''}
              <th><input type="checkbox" id="ai-check-all" ${selectedCount === allCommands.length ? 'checked' : ''} /></th>
              </tr>
            </thead>
            <tbody>
              ${filteredCommands.map(function (cmd) {
    const isChecked = aiState.checkedIds[cmd.id] !== false;
    const cmdGroups = isFullMode
      ? (function () {const g = groups.find(function (gr) {return gr.id === cmd.groupId;}); return g ? g.title : (cmd.groupId || '');})()
      : '';
    return `
                  <tr class="${isChecked ? '' : 'ai-row-unchecked'}">
                    <td><strong>${escapeHtml(cmd.title)}</strong></td>
                    <td>${escapeHtml(cmd.description || '-')}</td>
                    <td><pre class="template-cell">${escapeHtml(cmd.command)}</pre></td>
                    ${isFullMode ? `<td>${escapeHtml(cmdGroups || '-')}</td>` : ''}
                    <td>
                      <input type="checkbox" class="ai-cmd-checkbox" data-cmd-id="${escapeAttr(cmd.id)}" ${isChecked ? 'checked' : ''} />
                    </td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
        <div class="row justify-content-flex-end mt-20">
          <span class="muted ai-results-count">${selectedCount} of ${allCommands.length} selected</span>
          <button class="btn small primary" id="btn-ai-insert" ${selectedCount === 0 ? 'disabled' : ''}>Insert Selected (${selectedCount})</button>
          <button class="btn small secondary action min-w65" id="btn-ai-results-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

// ─── AI UI Bind Functions ─────────────────────────────────────────────────────

function bindAiEvents() {
  // ⚙️ AI Settings button (in header)
  const aiSettingsBtn = document.getElementById('btn-ai-settings');
  if (aiSettingsBtn) {
    aiSettingsBtn.addEventListener('click', function () {
      aiState.view = 'settings';
      aiState.apiKeyInput = '';
      // Fetch current settings from extension
      vscode.postMessage({type: 'aiGetSettings'});
    });
  }

  // "Create with AI" button (in manage tab)
  const createWithAiBtn = document.getElementById('btn-create-with-ai');
  if (createWithAiBtn) {
    createWithAiBtn.addEventListener('click', function () {
      aiState.mode = 'full';
      aiState.view = 'prompt';
      aiState.prompt = '';
      aiState.error = '';
      // Fetch current settings so providerName is always up-to-date before rendering
      vscode.postMessage({type: 'aiGetSettings'});
    });
  }

  // "Add with AI" button (in commands tab)
  const addWithAiBtn = document.getElementById('btn-add-with-ai');
  if (addWithAiBtn) {
    addWithAiBtn.addEventListener('click', function () {
      const selectedCategory = getSelectedCategory();
      if (!selectedCategory) {return;}
      aiState.mode = 'single';
      aiState.categoryId = selectedCategory.id;
      aiState.groupId = uiState.selectedGroupId !== 'all' ? uiState.selectedGroupId : '';
      aiState.view = 'prompt';
      aiState.prompt = '';
      aiState.error = '';
      // Fetch current settings so providerName is always up-to-date before rendering
      vscode.postMessage({type: 'aiGetSettings'});
    });
  }

  // --- Settings modal events ---
  if (aiState.view === 'settings') {
    // Bind AI provider custom select
    bindCustomSelect(
      'ai-provider-select-wrap',
      'ai-provider-select-btn',
      'ai-provider-select-menu',
      function (newProvider) {
        aiState.settingsProviderName = newProvider;
        aiState.apiKeyInput = '';
        render();
      }
    );

    const apiKeyInput = document.getElementById('ai-api-key-input');
    if (apiKeyInput) {
      apiKeyInput.addEventListener('input', function () {
        aiState.apiKeyInput = apiKeyInput.value;
      });
    }

    // 🔑 "Get API Key" link — opens provider's website in browser
    const getApiKeyLink = document.getElementById('btn-ai-get-api-key');
    if (getApiKeyLink) {
      getApiKeyLink.addEventListener('click', function (e) {
        e.preventDefault();
        const url = getApiKeyLink.dataset.url;
        if (url) {
          vscode.postMessage({type: 'openExternalUrl', payload: {url}});
        }
      });
    }

    // ❓ "How to get API Key?" link — opens the setup help modal
    const showHelpLink = document.getElementById('btn-ai-show-setup-help');
    if (showHelpLink) {
      showHelpLink.addEventListener('click', function (e) {
        e.preventDefault();
        aiProviderSetupModalState = {
          visible: true,
          providerName: aiState.settingsProviderName,
        };
        render();
      });
    }

    const saveBtn = document.getElementById('btn-ai-settings-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', function () {
        vscode.postMessage({
          type: 'aiSaveSettings',
          payload: {
            providerName: aiState.settingsProviderName,
            apiKey: aiState.apiKeyInput,
          },
        });
        aiState.view = null;
        aiState.apiKeyInput = '';
      });
    }

    const cancelBtn = document.getElementById('btn-ai-settings-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        aiState.view = null;
        aiState.apiKeyInput = '';
        render();
      });
    }

  }

  // --- AI Provider Setup Help modal events ---
  if (aiProviderSetupModalState.visible) {
    // 🌐 Open URL link inside setup modal
    const setupOpenUrlLink = document.getElementById('btn-ai-setup-open-url');
    if (setupOpenUrlLink) {
      setupOpenUrlLink.addEventListener('click', function (e) {
        e.preventDefault();
        const url = setupOpenUrlLink.dataset.url;
        if (url) {
          vscode.postMessage({type: 'openExternalUrl', payload: {url}});
        }
      });
    }

    // Close button inside setup modal
    const setupCloseBtn = document.getElementById('btn-ai-setup-close');
    if (setupCloseBtn) {
      setupCloseBtn.addEventListener('click', function () {
        aiProviderSetupModalState = {visible: false, providerName: null};
        render();
      });
    }
  }

  // --- Prompt modal events ---
  if (aiState.view === 'prompt') {
    const textarea = document.getElementById('ai-prompt-textarea');
    if (textarea) {
      textarea.addEventListener('input', function () {
        aiState.prompt = textarea.value;
      });
      // Focus textarea
      setTimeout(function () {if (textarea) {textarea.focus();} }, 50);
    }

    const generateBtn = document.getElementById('btn-ai-generate');
    if (generateBtn) {
      generateBtn.addEventListener('click', function () {
        const prompt = document.getElementById('ai-prompt-textarea');
        const promptValue = prompt ? prompt.value.trim() : aiState.prompt.trim();
        if (!promptValue) {
          aiState.error = 'Please enter a prompt.';
          render();
          return;
        }
        aiState.prompt = promptValue;
        aiState.error = '';
        aiState.view = 'loading';
        render();

        vscode.postMessage({
          type: 'aiGenerate',
          payload: {
            mode: aiState.mode,
            prompt: promptValue,
            categoryId: aiState.categoryId,
            groupId: aiState.groupId,
          },
        });
      });
    }

    const cancelBtn = document.getElementById('btn-ai-prompt-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        aiState.view = null;
        aiState.error = '';
        aiState.prompt = '';
        render();
      });
    }

    const aiModelLabelLink = document.getElementById('ai-model-label-link');
    if (aiModelLabelLink) {
      aiModelLabelLink.addEventListener('click', function (e) {
        e.preventDefault();
        const url = aiModelLabelLink.dataset.url;
        if (url) {
          vscode.postMessage({type: 'openExternalUrl', payload: {url}});
        }
      });
    }
  }

  // --- Results modal events ---
  if (aiState.view === 'results') {
    const checkAll = document.getElementById('ai-check-all');
    if (checkAll) {
      checkAll.addEventListener('change', function () {
        const allCommands = aiState.mode === 'full' ? (aiState.result.commands || []) : [aiState.result];
        const newChecked = {};
        allCommands.forEach(function (cmd) {newChecked[cmd.id] = checkAll.checked;});
        aiState.checkedIds = newChecked;
        render();
      });
    }

    document.querySelectorAll('.ai-cmd-checkbox').forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        aiState.checkedIds[checkbox.dataset.cmdId] = checkbox.checked;
        // Update UI without full re-render to preserve scroll position
        const allCommands = aiState.mode === 'full' ? (aiState.result.commands || []) : [aiState.result];
        const selectedCount = Object.values(aiState.checkedIds).filter(Boolean).length;
        // Toggle row dimming class
        const row = checkbox.closest('tr');
        if (row) {
          if (checkbox.checked) {
            row.classList.remove('ai-row-unchecked');
          } else {
            row.classList.add('ai-row-unchecked');
          }
        }
        // Update count text
        const countEl = document.querySelector('.ai-results-count');
        if (countEl) {countEl.textContent = selectedCount + ' of ' + allCommands.length + ' selected';}
        // Update insert button
        const insertBtn = document.getElementById('btn-ai-insert');
        if (insertBtn) {
          insertBtn.disabled = selectedCount === 0;
          insertBtn.textContent = 'Insert Selected (' + selectedCount + ')';
        }
        // Update check-all checkbox
        const checkAll = document.getElementById('ai-check-all');
        if (checkAll) {checkAll.checked = selectedCount === allCommands.length;}
      });
    });

    document.querySelectorAll('[data-ai-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        aiState.filterGroupId = btn.dataset.aiFilter;
        render();
      });
    });

    const insertBtn = document.getElementById('btn-ai-insert');
    if (insertBtn) {
      insertBtn.addEventListener('click', function () {
        const allCommands = aiState.mode === 'full' ? (aiState.result.commands || []) : [aiState.result];
        const selectedCommands = allCommands.filter(function (cmd) {
          return aiState.checkedIds[cmd.id] !== false;
        });

        if (!selectedCommands.length) {return;}

        vscode.postMessage({
          type: 'aiInsert',
          payload: {
            mode: aiState.mode,
            category: aiState.mode === 'full' ? (aiState.result.category || null) : null,
            commands: selectedCommands,
          },
        });
      });
    }

    const cancelBtn = document.getElementById('btn-ai-results-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        aiState.view = null;
        aiState.result = null;
        aiState.error = '';
        render();
      });
    }
  }
}

/**
 * Scrolls to a row with the given commandId and temporarily highlights it.
 * Works for both the commands table and the recent commands table.
 * @param {string} commandId
 */
function scrollToAndHighlight(commandId) {
  if (!commandId) {return;}
  // Find a button inside the row that carries the commandId
  var btn = document.querySelector('[data-command-id="' + commandId + '"]');
  if (!btn) {return;}
  var row = btn.closest('tr');
  if (!row) {return;}
  row.classList.add('row-highlight');
  row.scrollIntoView({behavior: 'smooth', block: 'center'});
  setTimeout(function () {
    row.classList.remove('row-highlight');
  }, 2000);
}

// ─── Favorites Tab & Helpers ──────────────────────────────────────────────────

/**
 * Returns true if commandId is in either local or global favorites.
 */
function isInFavorites(commandId) {
  return state.globalFavorites.includes(commandId) || state.localFavorites.includes(commandId);
}

/**
 * Returns the scope of the favorite: 'none' | 'local' | 'global' | 'both'
 */
function getFavoriteScope(commandId) {
  const inLocal = state.localFavorites.includes(commandId);
  const inGlobal = state.globalFavorites.includes(commandId);
  if (inLocal && inGlobal) {return 'both';}
  if (inLocal) {return 'local';}
  if (inGlobal) {return 'global';}
  return 'none';
}

/**
 * Saves favorites to the extension.
 */
function persistFavorites(payload) {
  vscode.postMessage({type: 'saveFavorites', payload});
}

/**
 * Renders the Favorites tab.
 */
function renderFavoritesTab() {
  const hasWorkspace = !!state.workspaceFolder;
  const scope = uiState.favoritesScope;
  const favoriteIds = scope === 'local' ? state.localFavorites : state.globalFavorites;
  const favoritedCommands = (state.data.commands || []).filter(function (cmd) {
    return favoriteIds.includes(cmd.id);
  });
  const emptyMsg = scope === 'local'
    ? 'No local favorites for this workspace yet. Click the star icon on any command to add it.'
    : 'No global favorites yet. Click the star icon on any command to add it.';

  let skipConfirm = false;
  try {skipConfirm = localStorage.getItem('unfav_confirm_skip') === '1';} catch { }

  const showWrap = hasWorkspace || skipConfirm;

  return `
    <section class="card">
      ${showWrap ? renderFavoritesScopeToggle(scope, hasWorkspace, skipConfirm) : ''}
      <div class="table-wrap">
        ${favoritedCommands.length === 0
      ? `<p class="muted">${emptyMsg}</p>`
      : renderFavoritesTable(favoritedCommands)
    }
      </div>
    </section>
  `;
}

/**
 * Renders the big scope toggle (Local Workspace / Global) for the Favorites tab.
 * @param {string} scope - current favorites scope ('local' | 'global')
 * @param {boolean} showToggle - whether to show the scope toggle (requires workspace)
 * @param {boolean} skipConfirm - whether to show the restore confirmation link
 */
function renderFavoritesScopeToggle(scope, showToggle, skipConfirm) {
  return `
    <div class="fav-scope-toggle-wrap">
      ${showToggle ? `
      <div class="fav-scope-toggle-section">
        <div class="fav-scope-toggle">
          <button class="fav-scope-btn ${scope === 'local' ? 'active' : ''}" data-scope="local" data-tooltip="Show favorites for this workspace only">Local Workspace</button>
          <button class="fav-scope-btn ${scope === 'global' ? 'active' : ''}" data-scope="global" data-tooltip="Show favorites available in all workspaces">Global</button>
        </div>
        <span class="muted fav-scope-hint">${scope === 'local' ? escapeHtml(state.workspaceFolder || '') : 'Available everywhere'}</span>
      </div>` : `<p class="muted margin-block-0">Showing only global favorites, as no workspace is currently open.</p>`}
      ${skipConfirm ? `<p class="muted margin-block-0">Removal confirmations are disabled. <a href="#" id="btn-restore-unfav-confirm" data-tooltip="Re-enable the confirmation dialog when removing from favorites">Restore</a></p>` : ''}
    </div>
  `;
}

/**
 * Renders the favorites table (Title, Template, Actions).
 * Uses iconHeartMinus() for the remove button.
 */
function renderFavoritesTable(commands) {
  return `
    <table class="cmds-table favorites-table main-table">
      <thead>
        <tr>
          <th class="main-t-title-column">Title</th>
          <th class="main-t-description-column">Description</th>
          <th class="main-t-template-column">Template</th>
          <th class="main-t-groups-column">Groups</th>
          <th class="main-t-action-column">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${commands.map(function (command) {
    const titleHtml = command.helpUrl
      ? `<a class="cmd-title-link" data-url="${escapeAttr(command.helpUrl)}" data-tooltip="Open documentation">${escapeHtml(command.title)}</a>`
      : `<strong>${escapeHtml(command.title)}</strong>`;
    const _useVars = collectVariables([command.command]).filter(function (n) {return n !== 'workspaceFolder';});
    const _useMissing = getMissingVariables(command);
    const _useCtrlHint = _useVars.length > 0 && _useMissing.length === 0;
    const _useTitle = _useCtrlHint ? 'Use in terminal\nPress CTRL key to edit the variables' : 'Use in terminal';
    const _scope = uiState.favoritesScope;
    const _scopeLabel = _scope === 'local' ? 'Local Workspace' : 'Global';
    const _cat = (state.data.categories || []).find(function (c) {return c.id === command.categoryId;});
    const _groups = _cat ? (_cat.groups || []) : [];
    const _groupTitle = resolveGroupTitle(command.groupId || '', _groups);
    return `
            <tr data-command-id="${escapeAttr(command.id)}">
              <td class="main-t-title-column">${titleHtml}<br><span class="muted">${escapeHtml(command.id)}</span></td>
              <td class="main-t-description-column">${escapeHtml(command.description || '-')}</td>
              <td class="main-t-template-column"><pre class="template-cell">${escapeHtml(command.command)}</pre></td>
              <td class="main-t-groups-column">${escapeHtml(_groupTitle)}</td>
              <td class="main-t-action-column">
                <div class="actions-cell">
                  <button class="btn icon-btn success btn-run" data-command-id="${escapeAttr(command.id)}" data-tooltip="Run command">${iconRun()}</button>
                  ${command.command.includes('\n') ? `<button class="btn icon-btn secondary" disabled data-tooltip="Use is not available for multi-line commands">${iconUse()}</button>` : `<button class="btn icon-btn secondary btn-use action" data-command-id="${escapeAttr(command.id)}" data-tooltip="${escapeAttr(_useTitle)}">${iconUse()}</button>`}
                  <button class="btn icon-btn secondary btn-copy action" data-command-id="${escapeAttr(command.id)}" data-tooltip="Copy to clipboard">${iconCopy()}</button>
                  <button class="btn icon-btn secondary btn-edit action" data-command-id="${escapeAttr(command.id)}" data-tooltip="Edit command">${iconEdit()}</button>
                  <button class="btn icon-btn danger btn-delete-command" data-command-id="${escapeAttr(command.id)}" data-tooltip="Delete command">${iconDelete()}</button>
                  <button class="btn icon-btn secondary btn-unfavorite" data-command-id="${escapeAttr(command.id)}" data-tooltip="Remove from ${escapeAttr(_scopeLabel)} favorites<br>CTRL+click to open manage panel">${iconHeartMinus()}</button>
                </div>
              </td>
            </tr>
          `;
  }).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Renders the unified Favorite modal (manage favorites: add/remove/toggle local+global).
 * opened from Commands/Recent tabs and from Favorites tab CTRL+click.
 */
function renderFavoriteModal() {
  const s = favoriteModalState;
  const hasWorkspace = !!state.workspaceFolder;
  const command = (state.data.commands || []).find(function (c) {return c.id === s.commandId;});
  const cmdTitle = command ? command.title : '';
  const noneSelected = !s.selectedLocal && !s.selectedGlobal;
  // Only show warning/Unfavorite if command was already in at least one favorites list
  const wasInFavorites = isInFavorites(s.commandId);

  return `
    <div class="modal-overlay" id="favorite-modal-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box">
        <h3>${iconHeartPlus()} Manage Favorites</h3>
        <p class="delete-confirm-command-name">${escapeHtml(cmdTitle)}</p>
        <p class="modal-description">Select where to save this command as a favorite:</p>
        <div class="fav-modal-tags">
          ${hasWorkspace ? `<button class="tag fav-modal-tag ${s.selectedLocal ? 'active' : ''}" data-scope="local" data-tooltip="Save for this workspace only">Local Workspace</button>` : ''}
          <button class="tag fav-modal-tag ${s.selectedGlobal ? 'active' : ''}" data-scope="global" data-tooltip="Save for all workspaces">Global</button>
        </div>
        ${(wasInFavorites && noneSelected) ? `<p class="modal-description fav-modal-hint">No selection — clicking Save will remove from all favorites.</p>` : ''}
        <div class="row between mt-20">
          ${wasInFavorites ? `<button class="btn small danger" id="btn-fav-unfavorite-all" data-tooltip="Remove from all favorites immediately">Unfavorite</button>` : '<span></span>'}
          <div class="row">
            <button class="btn small primary min-w65" id="btn-fav-save">Save</button>
            <button class="btn small secondary action min-w65" id="btn-fav-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the unfavorite confirm modal (normal click on btn-unfavorite in Favorites tab).
 */
function renderUnfavoriteConfirmModal() {
  if (!unfavoriteConfirmState.visible) {return '';}
  const s = unfavoriteConfirmState;
  const command = (state.data.commands || []).find(function (c) {return c.id === s.commandId;});
  const cmdTitle = command ? command.title : '';
  const scopeLabel = s.scope === 'local' ? 'Local Workspace' : 'Global';
  let skipConfirm = false;
  try {skipConfirm = localStorage.getItem('unfav_confirm_skip') === '1';} catch { }

  return `
    <div class="modal-overlay" id="unfav-confirm-overlay" data-dismiss-on-outside-click="false">
      <div class="modal-box">
        <h3>Remove from Favorites</h3>
        <p class="modal-description">Remove from <strong>"${escapeHtml(scopeLabel)}"</strong> favorites?</p>
        <p class="delete-confirm-command-name">${escapeHtml(cmdTitle)}</p>
        <label class="fav-dont-show-wrap">
          <input type="checkbox" id="unfav-dont-show-again" ${skipConfirm ? 'checked' : ''} />
          Don't show this message again
        </label>
        <div class="row justify-content-flex-end mt-20">
          <button class="btn small danger min-w65" id="btn-unfav-confirm-remove">Remove</button>
          <button class="btn small secondary action min-w65" id="btn-unfav-confirm-cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Binds events for the Favorites tab (scope toggle + unfavorite buttons).
 */
function bindFavoritesTabEvents() {
  // Scope toggle buttons
  document.querySelectorAll('.fav-scope-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const scope = btn.dataset.scope;
      uiState.favoritesScope = scope;
      try {localStorage.setItem('favoritesScope', scope);} catch { }
      render();
    });
  });

  // Unfavorite buttons (iconHeartMinus)
  document.querySelectorAll('.btn-unfavorite').forEach(function (button) {
    button.addEventListener('click', function (e) {
      const commandId = button.dataset.commandId;
      const scope = uiState.favoritesScope;

      if (e.ctrlKey) {
        // CTRL+click → open unified manage modal with current state pre-filled
        favoriteModalState = {
          visible: true,
          commandId,
          selectedLocal: state.localFavorites.includes(commandId),
          selectedGlobal: state.globalFavorites.includes(commandId),
        };
        render();
        return;
      }

      // Normal click: check "Don't show again" setting
      let skipConfirm = false;
      try {skipConfirm = localStorage.getItem('unfav_confirm_skip') === '1';} catch { }

      if (skipConfirm) {
        // Remove directly
        if (scope === 'local') {
          const newLocal = state.localFavorites.filter(function (id) {return id !== commandId;});
          state.localFavorites = newLocal;
          persistFavorites({local: newLocal});
          showNotice('Removed from Local Workspace Favorites.', iconHeartMinus(), 'info');
        } else {
          const newGlobal = state.globalFavorites.filter(function (id) {return id !== commandId;});
          state.globalFavorites = newGlobal;
          persistFavorites({global: newGlobal});
          showNotice('Removed from Global Favorites.', iconHeartMinus(), 'info');
        }
        render();
      } else {
        // Show confirm modal
        unfavoriteConfirmState = {visible: true, commandId, scope};
        render();
      }
    });
  });

  // Restore unfav confirmation dialog
  const restoreUnfavConfirmBtn = document.getElementById('btn-restore-unfav-confirm');
  if (restoreUnfavConfirmBtn) {
    restoreUnfavConfirmBtn.addEventListener('click', function (e) {
      e.preventDefault();
      try {localStorage.removeItem('unfav_confirm_skip');} catch { }
      render();
    });
  }

  bindUnfavoriteConfirmEvents();
}

/**
 * Binds events for the unified Favorite modal (tag-style selection).
 */
function bindFavoriteModalEvents() {
  // Tag toggle buttons (Local Workspace / Global)
  document.querySelectorAll('.fav-modal-tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
      const scope = tag.dataset.scope;
      if (scope === 'local') {
        favoriteModalState.selectedLocal = !favoriteModalState.selectedLocal;
      } else if (scope === 'global') {
        favoriteModalState.selectedGlobal = !favoriteModalState.selectedGlobal;
      }
      render();
    });
  });

  // Unfavorite All button → remove from ALL favorites
  const unfavAllBtn = document.getElementById('btn-fav-unfavorite-all');
  if (unfavAllBtn) {
    unfavAllBtn.addEventListener('click', function () {
      const commandId = favoriteModalState.commandId;
      if (commandId) {
        const newGlobal = state.globalFavorites.filter(function (id) {return id !== commandId;});
        const newLocal = state.localFavorites.filter(function (id) {return id !== commandId;});
        state.globalFavorites = newGlobal;
        state.localFavorites = newLocal;
        persistFavorites({global: newGlobal, local: newLocal});
        showNotice('Removed from all favorites.', iconHeartMinus(), 'info');
      }
      favoriteModalState = {visible: false, commandId: null, selectedLocal: false, selectedGlobal: false};
      render();
    });
  }

  // Save button → apply tag selection
  const saveBtn = document.getElementById('btn-fav-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      const commandId = favoriteModalState.commandId;
      const wantLocal = favoriteModalState.selectedLocal;
      const wantGlobal = favoriteModalState.selectedGlobal;

      if (commandId) {
        // Apply global
        let newGlobal;
        if (wantGlobal && !state.globalFavorites.includes(commandId)) {
          newGlobal = state.globalFavorites.concat([commandId]);
        } else if (!wantGlobal && state.globalFavorites.includes(commandId)) {
          newGlobal = state.globalFavorites.filter(function (id) {return id !== commandId;});
        } else {
          newGlobal = state.globalFavorites;
        }

        // Apply local
        let newLocal;
        if (wantLocal && !state.localFavorites.includes(commandId)) {
          newLocal = state.localFavorites.concat([commandId]);
        } else if (!wantLocal && state.localFavorites.includes(commandId)) {
          newLocal = state.localFavorites.filter(function (id) {return id !== commandId;});
        } else {
          newLocal = state.localFavorites;
        }

        state.globalFavorites = newGlobal;
        state.localFavorites = newLocal;
        persistFavorites({global: newGlobal, local: newLocal});

        if (!wantGlobal && !wantLocal) {
          showNotice('Removed from all favorites.', iconHeartMinus(), 'info');
        } else if (wantGlobal && wantLocal) {
          showNotice('Saved to Local & Global Favorites.', iconHeartPlus(), 'success');
        } else if (wantGlobal) {
          showNotice('Saved to Global Favorites.', iconHeartPlus(), 'success');
        } else {
          showNotice('Saved to Local Favorites.', iconHeartPlus(), 'success');
        }
      }

      favoriteModalState = {visible: false, commandId: null, selectedLocal: false, selectedGlobal: false};
      render();
    });
  }

  // Cancel button
  const cancelBtn = document.getElementById('btn-fav-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      favoriteModalState = {visible: false, commandId: null, selectedLocal: false, selectedGlobal: false};
      render();
    });
  }

  // Flash on outside click (modal stays)
  const overlay = document.getElementById('favorite-modal-overlay');
  if (overlay) {
    overlay.addEventListener('pointerdown', function (e) {
      if (e.target === overlay) {
        var box = overlay.querySelector('.modal-box');
        if (box) {
          box.classList.remove('modal-box-flash');
          void box.offsetWidth;
          box.classList.add('modal-box-flash');
          box.addEventListener('animationend', function () {
            box.classList.remove('modal-box-flash');
          }, {once: true});
        }
      }
    });
  }
}

/**
 * Binds events for the unfavorite confirm modal.
 */
function bindUnfavoriteConfirmEvents() {
  const removeBtn = document.getElementById('btn-unfav-confirm-remove');
  if (removeBtn) {
    removeBtn.addEventListener('click', function () {
      const commandId = unfavoriteConfirmState.commandId;
      const scope = unfavoriteConfirmState.scope;

      // Save "don't show again" preference
      const checkbox = document.getElementById('unfav-dont-show-again');
      if (checkbox && checkbox.checked) {
        try {localStorage.setItem('unfav_confirm_skip', '1');} catch { }
      }

      // Remove from scope
      if (scope === 'local') {
        const newLocal = state.localFavorites.filter(function (id) {return id !== commandId;});
        state.localFavorites = newLocal;
        persistFavorites({local: newLocal});
      } else {
        const newGlobal = state.globalFavorites.filter(function (id) {return id !== commandId;});
        state.globalFavorites = newGlobal;
        persistFavorites({global: newGlobal});
      }

      unfavoriteConfirmState = {visible: false, commandId: null, scope: null};
      showNotice('Removed from Favorites.', iconHeartMinus(), 'info');
      render();
    });
  }

  const cancelBtn = document.getElementById('btn-unfav-confirm-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      unfavoriteConfirmState = {visible: false, commandId: null, scope: null};
      render();
    });
  }

  // Flash on outside click
  const overlay = document.getElementById('unfav-confirm-overlay');
  if (overlay) {
    overlay.addEventListener('pointerdown', function (e) {
      if (e.target === overlay) {
        var box = overlay.querySelector('.modal-box');
        if (box) {
          box.classList.remove('modal-box-flash');
          void box.offsetWidth;
          box.classList.add('modal-box-flash');
          box.addEventListener('animationend', function () {
            box.classList.remove('modal-box-flash');
          }, {once: true});
        }
      }
    });
  }
}

// Disable right-click context menu unless text is selected
document.addEventListener('contextmenu', function (e) {
  const selection = window.getSelection();
  if (!selection || selection.toString().trim() === '') {
    e.preventDefault();
  }
});

// ===== VS Code-style Tooltip =====
(function () {
  let _hoverEl = null;
  let _showTimer = null;
  const DELAY = 550; // ms — same feel as VS Code
  const GAP = 6;     // px — gap between element and tooltip

  function getOrCreateTooltip() {
    if (!_hoverEl) {
      _hoverEl = document.createElement('div');
      _hoverEl.className = 'tr-tooltip-hover';
      _hoverEl.setAttribute('role', 'tooltip');
      const inner = document.createElement('div');
      inner.className = 'tr-tooltip-hover-content';
      _hoverEl.appendChild(inner);
    }
    return _hoverEl;
  }

  function positionTooltip(el) {
    const tip = getOrCreateTooltip();
    const pos = el.dataset.tooltipPos || 'bottom';

    // Temporarily attach (hidden) to measure dimensions
    tip.style.visibility = 'hidden';
    tip.style.left = '0px';
    tip.style.top = '0px';
    if (!tip.isConnected) document.body.appendChild(tip);

    const rect = el.getBoundingClientRect();
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;

    let left, top;

    if (pos === 'top') {
      left = rect.left + rect.width / 2 - tw / 2;
      top = rect.top - th - GAP;
    } else if (pos === 'right') {
      left = rect.right + GAP;
      top = rect.top + rect.height / 2 - th / 2;
    } else if (pos === 'left') {
      left = rect.left - tw - GAP;
      top = rect.top + rect.height / 2 - th / 2;
    } else {
      // bottom (default)
      left = rect.left + rect.width / 2 - tw / 2;
      top = rect.bottom + GAP;
    }

    // Clamp to viewport so it doesn't go off-screen
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    left = Math.max(GAP, Math.min(left, vw - tw - GAP));
    top = Math.max(GAP, Math.min(top, vh - th - GAP));

    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
    tip.dataset.pos = pos; // used by CSS to show the correct arrow direction
    tip.style.visibility = '';
  }

  function showTooltip(el) {
    const tip = getOrCreateTooltip();
    tip.querySelector('.tr-tooltip-hover-content').innerHTML = el.dataset.tooltip;
    positionTooltip(el);
  }

  function hideTooltip() {
    clearTimeout(_showTimer);
    _showTimer = null;
    _hoverEl?.remove();
  }

  document.addEventListener('mouseover', function (e) {
    const el = e.target.closest('[data-tooltip]');
    if (!el) return;

    // Cancel any pending show for a different element
    clearTimeout(_showTimer);

    _showTimer = setTimeout(function () {
      showTooltip(el);
    }, DELAY);
  });

  document.addEventListener('mouseout', function (e) {
    const fromEl = e.target.closest('[data-tooltip]');
    const toEl = e.relatedTarget?.closest('[data-tooltip]');

    // Mouse stayed within tooltip-owning elements — do nothing
    if (fromEl && toEl && fromEl === toEl) return;

    hideTooltip();
  });

  // Hide immediately on any click/tap — before any handler fires
  document.addEventListener('pointerdown', function () {
    hideTooltip();
  });
})();

vscode.postMessage({type: 'ready'});
