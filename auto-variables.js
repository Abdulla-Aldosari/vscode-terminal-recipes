"use strict";

const os = require("os");
const path = require("path");

/**
 * قائمة المتغيرات التلقائية.
 * لإضافة متغير جديد: أضف كائناً جديداً هنا فقط — لا تعديل في أي ملف آخر.
 */
const AUTO_VARIABLES = [
    {
        name: "workspaceFolder",
        label: "Workspace Folder",
        description: "Full path to the current workspace folder.",
        previewExample: "/home/user/my-project",
        defaultEnabled: true,
        configurable: false,
        config: null,
        resolve: function (context) {
            return context.workspaceFolder || "";
        },
    },
    {
        name: "workspaceName",
        label: "Workspace Name",
        description: "Name of the current workspace folder (basename only).",
        previewExample: "my-project",
        defaultEnabled: true,
        configurable: false,
        config: null,
        resolve: function (context) {
            return context.workspaceFolder
                ? path.basename(context.workspaceFolder)
                : "";
        },
    },
    {
        name: "username",
        label: "OS Username",
        description: "Current operating system username.",
        previewExample: "john",
        defaultEnabled: true,
        configurable: false,
        config: null,
        resolve: function () {
            return os.userInfo().username || "";
        },
    },
    {
        name: "date",
        label: "Current Date",
        description: "Today's date formatted as specified.",
        previewExample: "2026-05-26",
        defaultEnabled: false,
        configurable: true,
        config: {
            format: "YYYY-MM-DD",
        },
        resolve: function (context, userConfig) {
            return formatDate(
                userConfig && userConfig.format ? userConfig.format : "YYYY-MM-DD",
            );
        },
    },
];

/**
 * يُنسّق التاريخ الحالي حسب الصيغة المطلوبة.
 * الصيغ المدعومة: YYYY-MM-DD | DD/MM/YYYY | MM/DD/YYYY | DD-MM-YYYY
 */
function formatDate(format) {
    const now = new Date();
    const yyyy = now.getFullYear().toString();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    return format.replace("YYYY", yyyy).replace("MM", mm).replace("DD", dd);
}

/**
 * يحل جميع المتغيرات التلقائية المفعّلة في نص القالب.
 *
 * @param {string} template        - نص الأمر الذي يحتوي على ${varName}
 * @param {object} context         - السياق: { workspaceFolder: string|null }
 * @param {object} userSettings    - إعدادات المستخدم: { varName: { enabled, config } }
 * @returns {string}               - النص بعد استبدال المتغيرات
 */
function resolveAutoVariables(template, context, userSettings) {
    if (typeof template !== "string") {
        return template;
    }

    let resolved = template;

    AUTO_VARIABLES.forEach(function (varDef) {
        const setting = userSettings && userSettings[varDef.name];
        const isEnabled =
            setting !== undefined ? Boolean(setting.enabled) : varDef.defaultEnabled;

        if (!isEnabled) {
            return;
        }

        const userConfig =
            setting && setting.config ? setting.config : varDef.config || {};
        const value = varDef.resolve(context || {}, userConfig);

        resolved = resolved.replace(
            new RegExp("\\$\\{" + varDef.name + "\\}", "g"),
            value,
        );
    });

    return resolved;
}

/**
 * يرجع قائمة أسماء جميع المتغيرات التلقائية (للاستخدام في الفلترة).
 * @returns {string[]}
 */
function getAutoVariableNames() {
    return AUTO_VARIABLES.map(function (v) {
        return v.name;
    });
}

/**
 * يُولّد كائن preview لكل متغير (القيمة الفعلية الحالية).
 * يُرسَل من extension.js إلى الـ webview ضمن state.
 *
 * @param {object} context         - { workspaceFolder: string|null }
 * @param {object} userSettings    - { varName: { enabled, config } }
 * @returns {Array<{name, label, description, enabled, configurable, config, currentValue, configOptions}>}
 */
function buildAutoVariablesPayload(context, userSettings) {
    return AUTO_VARIABLES.map(function (varDef) {
        const setting = userSettings && userSettings[varDef.name];
        const isEnabled =
            setting !== undefined ? Boolean(setting.enabled) : varDef.defaultEnabled;
        const userConfig =
            setting && setting.config ? setting.config : varDef.config || {};
        const currentValue = isEnabled
            ? varDef.resolve(context || {}, userConfig)
            : varDef.previewExample;

        return {
            name: varDef.name,
            label: varDef.label,
            description: varDef.description,
            enabled: isEnabled,
            configurable: varDef.configurable,
            config: userConfig,
            currentValue: currentValue,
            configOptions:
                varDef.name === "date"
                    ? ["YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "DD-MM-YYYY"]
                    : [],
        };
    });
}

module.exports = {
    AUTO_VARIABLES,
    resolveAutoVariables,
    getAutoVariableNames,
    buildAutoVariablesPayload,
};
