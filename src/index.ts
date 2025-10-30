// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as a1lib from "alt1/base";

// tell webpack that this file relies index.html, appconfig.json and icon.png, this makes webpack
// add these files to the output directory
// this works because in /webpack.config.js we told webpack to treat all html, json and imageimports
// as assets
import "./index.html";
import "./appconfig.json";
import "./icon.png";

interface Zygomite {
	name: string;
	catched: boolean;
}

var output = document.getElementById("output");

// Array de zygomitas antigas de Anachronia que ainda não foram capturadas
var zygomites: Zygomite[] = [
	{ name: "Frank", catched: false },
	{ name: "Happy", catched: false },
	{ name: "Dank", catched: false },
	{ name: "Bobby", catched: false },
	{ name: "Pete", catched: false },
	{ name: "Travis", catched: false },
	{ name: "Wayne", catched: false },
	{ name: "Morty", catched: false },
	{ name: "Beverly", catched: false },
	{ name: "Dabby", catched: false },
	{ name: "Pat", catched: false },
	{ name: "Nero", catched: false },
	{ name: "Edd", catched: false },
	{ name: "June", catched: false },
	{ name: "Stuart", catched: false },
	{ name: "Clay", catched: false },
	{ name: "Nate", catched: false },
	{ name: "Howard", catched: false },
	{ name: "Bernadette", catched: false },
	{ name: "Raj", catched: false },
	{ name: "Noel", catched: false },
	{ name: "Carter", catched: false },
	{ name: "James", catched: false },
	{ name: "Jerry", catched: false },
	{ name: "Abel", catched: false },
	{ name: "John", catched: false },
	{ name: "Charlie", catched: false },
	{ name: "Dennis", catched: false },
	{ name: "Rami", catched: false },
	{ name: "Opie", catched: false },
	{ name: "Cricket", catched: false },
	{ name: "Olivia", catched: false },
	{ name: "Mac", catched: false },
	{ name: "Dee", catched: false },
	{ name: "Tig", catched: false },
	{ name: "Jenny", catched: false },
	{ name: "Juice", catched: false },
	{ name: "Jeremy", catched: false },
	{ name: "Leonard", catched: false },
	{ name: "Chibs", catched: false },
	{ name: "Tara", catched: false },
	{ name: "Gemma", catched: false },
	{ name: "Jax", catched: false },
	{ name: "Beth", catched: false },
	{ name: "Penny", catched: false },
	{ name: "Jessica", catched: false },
	{ name: "Taylor", catched: false },
	{ name: "Amy", catched: false },
	{ name: "Summer", catched: false },
	{ name: "Rick", catched: false },
	{ name: "Barry", catched: false },
	{ name: "Chris", catched: false },
	{ name: "Richard", catched: false },
	{ name: "Dave", catched: false },
	{ name: "Eddy", catched: false },
	{ name: "Sheldon", catched: false },
	{ name: "Ruth", catched: false },
	{ name: "Liam", catched: false },
	{ name: "Mary", catched: false },
	{ name: "Ed", catched: false }
];

var isMonitoring = false;
var monitorInterval: NodeJS.Timeout | null = null;
var lastDialogueTitle = "";

// Sistema de fila para mensagens de overlay (evita flood)
interface OverlayMessage {
	text: string;
	color: number;
	size: number;
	x: number;
	y: number;
	duration: number;
}

var overlayQueue: OverlayMessage[] = [];
var isShowingOverlay = false;

// Estado de confirmação do reset
var isResetConfirming = false;

// Sistema de log de eventos
interface EventLog {
	timestamp: Date;
	message: string;
	type: 'success' | 'info' | 'warning' | 'error';
}

var eventLogs: EventLog[] = [];
const MAX_EVENT_LOGS = 100; // Mantém apenas os últimos 100 eventos

// Verifica se todas as zygomitas foram capturadas
function checkAllCaptured() {
	const caughtCount = zygomites.filter(z => z.catched).length;
	return caughtCount === zygomites.length;
}

// Sistema de tradução/i18n
type Language = 'en' | 'pt' | 'es' | 'de';

interface Translations {
	status: string;
	events: string;
	zygomitesTitle: string;
	captured: string;
	startMonitoring: string;
	stopMonitoring: string;
	reset: string;
	none: string;
	eventLog: string;
	noEvents: string;
	tip: string;
	tipText: string;
	monitoringStarted: string;
	monitoringStopped: string;
	zygomiteCaught: string;
	zygomiteMarked: string;
	zygomiteUnmarked: string;
	stateReset: string;
	alt1NotDetected: string;
	alt1AddApp: string;
	[key: string]: string;
}

const translations: Record<Language, Translations> = {
	en: {
		status: "Status",
		events: "Events",
		zygomitesTitle: "Ancient Zygomites of Anachronia",
		captured: "Spotted",
		startMonitoring: "Start Monitoring",
		stopMonitoring: "Stop Monitoring",
		reset: "Reset",
		none: "none",
		eventLog: "Event Log",
		noEvents: "No events yet",
		tip: "Tip:",
		tipText: "Click on the zygomite name to manually mark/unmark",
		monitoringStarted: "Monitoring started! Click on NPCs to capture zygomites.",
		monitoringStopped: "Monitoring stopped",
		zygomiteCaught: "Zygomite caught:",
		zygomiteMarked: "marked as captured",
		zygomiteUnmarked: "unmarked",
		stateReset: "State reset - all zygomites marked as not captured",
		alt1NotDetected: "Alt1 not detected, click",
		alt1AddApp: "here",
		addToAlt1Btn: "Alt1 not detected, click to add this app to Alt1",
		toAddApp: "to add this app to Alt1",
		monitoringActive: "Monitoring already active",
		needsAlt1: "You need to run this in Alt1 to monitor dialogues",
		noPixelPermission: "Pixel capture permission not enabled",
		npnNotFound: "NPC not found in list",
		alreadyMarked: "already marked previously",
		alt1NotAvailable: "Alt1 not available or no permission",
		zygomiteFound: "Zygomite found",
		found: "found",
		confirmReset: "Confirm reset",
		confirmResetTitle: "Confirm reset",
		resetCompleted: "Reset completed",
		hints: "Help",
		hintGameEnglish: "Set the game language to English for best detection"
	},
	pt: {
		status: "Status",
		events: "Eventos",
		zygomitesTitle: "Zygomitas Antigas de Anachronia",
		captured: "Encontradas",
		startMonitoring: "Iniciar Monitoramento",
		stopMonitoring: "Parar Monitoramento",
		reset: "Resetar",
		none: "nenhum",
		eventLog: "Log de Eventos",
		noEvents: "Nenhum evento ainda",
		tip: "Dica:",
		tipText: "Clique no nome da zygomita para marcar/desmarcar manualmente",
		monitoringStarted: "Monitoramento iniciado! Clique em NPCs para capturar zygomitas.",
		monitoringStopped: "Monitoramento parado",
		zygomiteCaught: "Zygomita capturada:",
		zygomiteMarked: "marcada como capturada",
		zygomiteUnmarked: "desmarcada",
		stateReset: "Estado resetado - todas as zygomitas marcadas como não capturadas",
		alt1NotDetected: "Alt1 não detectado, clique",
		alt1AddApp: "aqui",
		addToAlt1Btn: "Alt1 não detectado, clique para adicionar este app ao Alt1",
		toAddApp: "para adicionar este app ao Alt1",
		monitoringActive: "Monitoramento já está ativo",
		needsAlt1: "Você precisa executar isso no Alt1 para monitorar diálogos",
		noPixelPermission: "Permissão de captura de pixels não está habilitada",
		npnNotFound: "NPC não encontrado na lista",
		alreadyMarked: "já foi marcada anteriormente",
		alt1NotAvailable: "Alt1 não disponível ou sem permissão",
		zygomiteFound: "Zygomita encontrada",
		found: "encontrado",
		confirmReset: "Confirmar reset",
		confirmResetTitle: "Confirmar reset",
		resetCompleted: "Reset concluído",
			hints: "Ajuda",
			hintGameEnglish: "Deixe a linguagem do jogo em inglês para funcionar"
	},
	es: {
		status: "Estado",
		events: "Eventos",
		zygomitesTitle: "Zygomitas Antiguas de Anachronia",
		captured: "Capturadas",
		startMonitoring: "Iniciar monitoreo",
		stopMonitoring: "Detener monitoreo",
		reset: "Reiniciar",
		none: "ninguno",
		eventLog: "Registro de eventos",
		noEvents: "Aún no hay eventos",
		tip: "Consejo:",
		tipText: "Haz clic en el nombre para marcar/desmarcar manualmente",
		monitoringStarted: "¡Monitoreo iniciado! Haz clic en NPCs para capturar zygomitas.",
		monitoringStopped: "Monitoreo detenido",
		zygomiteCaught: "Zygomita capturada:",
		zygomiteMarked: "marcada como capturada",
		zygomiteUnmarked: "desmarcada",
		stateReset: "Estado reiniciado - todas marcadas como no capturadas",
		alt1NotDetected: "Alt1 no detectado, haz clic",
		alt1AddApp: "aquí",
		addToAlt1Btn: "Alt1 no detectado, haz clic para añadir esta app a Alt1",
		toAddApp: "para añadir esta app a Alt1",
		monitoringActive: "El monitoreo ya está activo",
		needsAlt1: "Necesitas ejecutar esto en Alt1 para monitorear diálogos",
		noPixelPermission: "Permiso de captura de píxeles no habilitado",
		npnNotFound: "NPC no encontrado en la lista",
		alreadyMarked: "ya estaba marcada",
		alt1NotAvailable: "Alt1 no disponible o sin permiso",
		zygomiteFound: "Zygomita encontrada",
		found: "encontrada",
		confirmReset: "Confirmar reinicio",
		confirmResetTitle: "Confirmar reinicio",
		resetCompleted: "Reinicio completado",
			hints: "Ayuda",
			hintGameEnglish: "Pon el idioma del juego en inglés para que funcione"
	},
	de: {
		status: "Status",
		events: "Ereignisse",
		zygomitesTitle: "Uralte Zygomiten von Anachronia",
		captured: "Gefunden",
		startMonitoring: "Überwachung starten",
		stopMonitoring: "Überwachung stoppen",
		reset: "Zurücksetzen",
		none: "keine",
		eventLog: "Ereignisprotokoll",
		noEvents: "Noch keine Ereignisse",
		tip: "Tipp:",
		tipText: "Klicke auf den Namen zum Markieren/Entfernen",
		monitoringStarted: "Überwachung gestartet! Klicke auf NPCs, um Zygomiten zu erfassen.",
		monitoringStopped: "Überwachung gestoppt",
		zygomiteCaught: "Zygomit erfasst:",
		zygomiteMarked: "als erfasst markiert",
		zygomiteUnmarked: "Markierung entfernt",
		stateReset: "Status zurückgesetzt - alle als nicht erfasst markiert",
		alt1NotDetected: "Alt1 nicht erkannt, klicke",
		alt1AddApp: "hier",
		addToAlt1Btn: "Alt1 nicht erkannt, klicke um diese App zu Alt1 hinzuzufügen",
		toAddApp: "um diese App zu Alt1 hinzuzufügen",
		monitoringActive: "Überwachung bereits aktiv",
		needsAlt1: "In Alt1 ausführen, um Dialoge zu überwachen",
		noPixelPermission: "Berechtigung zur Pixelaufnahme fehlt",
		npnNotFound: "NPC nicht in der Liste",
		alreadyMarked: "bereits markiert",
		alt1NotAvailable: "Alt1 nicht verfügbar oder keine Berechtigung",
		zygomiteFound: "Zygomit gefunden",
		found: "gefunden",
		confirmReset: "Zurücksetzen bestätigen",
		confirmResetTitle: "Zurücksetzen bestätigen",
		resetCompleted: "Zurücksetzen abgeschlossen",
			hints: "Hilfe",
			hintGameEnglish: "Stelle die Spielsprache auf Englisch, damit es funktioniert"
	}
};

var currentLanguage: Language = 'en'; // Inglês como padrão

function t(key: string): string {
	return translations[currentLanguage][key] || key;
}

function setLanguage(lang: Language) {
	currentLanguage = lang;
	saveLanguagePreference(lang);
	updateUI();
}

function loadLanguagePreference(): Language {
	try {
		const saved = localStorage.getItem('zygomite-tracker-language');
		if (saved === 'en' || saved === 'pt' || saved === 'es' || saved === 'de') {
			return saved;
		}
	} catch (e) {
		console.error("Error loading language preference:", e);
	}
	return 'en';
}

function saveLanguagePreference(lang: Language) {
	try {
		localStorage.setItem('zygomite-tracker-language', lang);
	} catch (e) {
		console.error("Error saving language preference:", e);
	}
}

// Adiciona um evento ao log
function addEventLog(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') {
	const event: EventLog = {
		timestamp: new Date(),
		message,
		type
	};
	
	eventLogs.push(event);
	
	// Limita o número de eventos armazenados
	if (eventLogs.length > MAX_EVENT_LOGS) {
		eventLogs.shift();
	}
	
	// Atualiza a aba de eventos se estiver visível
	updateEventsTab();
}

// Mostra uma mensagem na fila de overlays
function showOverlayQueued(text: string, color: number = a1lib.mixColor(16, 185, 129), size: number = 24, duration: number = 2000) {
	if (!window.alt1) return;
	
	const message: OverlayMessage = {
		text,
		color,
		size,
		x: Math.round(alt1.rsWidth / 2),
		y: Math.round(alt1.rsHeight / 2),
		duration
	};
	
	overlayQueue.push(message);
	processOverlayQueue();
}

// Processa a fila de overlays (mostra apenas uma por vez)
function processOverlayQueue() {
	if (!window.alt1 || isShowingOverlay || overlayQueue.length === 0) {
		return;
	}
	
	isShowingOverlay = true;
	const message = overlayQueue.shift()!;
	
	alt1.overLayTextEx(
		message.text,
		message.color,
		message.size,
		message.x,
		message.y,
		message.duration,
		"",
		true,
		true
	);
	
	// Após a duração, processa a próxima mensagem
	setTimeout(() => {
		isShowingOverlay = false;
		processOverlayQueue();
	}, message.duration);
}

// Carrega o estado salvo das zygomitas
function loadState() {
	const saved = localStorage.getItem("zygomites-state");
	if (saved) {
		try {
			zygomites = JSON.parse(saved);
		} catch (e) {
			console.error("Error loading state:", e);
		}
	}
}

// Salva o estado das zygomitas
function saveState() {
	localStorage.setItem("zygomites-state", JSON.stringify(zygomites));
}

// Alterna o estado de uma zygomita ao clicar nela
export function toggleZygomite(zygomiteName: string) {
	const zygomite = zygomites.find(z => z.name.toLowerCase() === zygomiteName.toLowerCase());
	if (zygomite) {
		zygomite.catched = !zygomite.catched;
		saveState();
		updateUI();
		updateNPCSelector();
		
		// Verifica se todas foram capturadas (apenas se foi marcada como capturada)
		if (zygomite.catched && checkAllCaptured()) {
			
			// Mostra mensagem especial
			showOverlayQueued(
				currentLanguage === 'en' ? '🎉 All Zygomites Captured! 🎉' : '🎉 Todas as Zygomitas Capturadas! 🎉',
				a1lib.mixColor(245, 158, 11), // amarelo/laranja
				28,
				5000
			);
		}
		
		// Feedback visual no jogo (usando fila para evitar flood)
		const overlayText = zygomite.catched 
			? `✓ ${zygomite.name} ${currentLanguage === 'en' ? 'found' : t('found')}!`
			: `○ ${zygomite.name} ${t('zygomiteUnmarked')}`;
		
		showOverlayQueued(
			overlayText,
			zygomite.catched ? a1lib.mixColor(16, 185, 129) : a1lib.mixColor(156, 163, 175),
			24,
			2000
		);
		
		const message = `${zygomite.catched ? '✓' : '○'} <strong>${zygomite.name}</strong> ${zygomite.catched ? t('zygomiteMarked') : t('zygomiteUnmarked')}`;
		addEventLog(message, zygomite.catched ? 'success' : 'info');
	}
}

// Atualiza a interface visual com sistema de abas
function updateUI() {
	const statusDiv = document.getElementById("status") || createStatusDiv();
	const caughtCount = zygomites.filter(z => z.catched).length;
	const totalCount = zygomites.length;
	
	const nextLangOrder: Language[] = ['en', 'pt', 'es', 'de'];
	const nextLang = nextLangOrder[(nextLangOrder.indexOf(currentLanguage) + 1) % nextLangOrder.length];
	const flagFor: Record<Language, string> = { en: 'fi fi-us', pt: 'fi fi-br', es: 'fi fi-es', de: 'fi fi-de' };
	const langButtonClass = flagFor[nextLang];
	const langButtonTitle = currentLanguage === 'en' ? 'Switch to Portuguese' : 'Switch to English';
	
	statusDiv.innerHTML = `
		<div class="menubar" style="margin-bottom:4px;">
			<div>
				<div id="tab-hints" onclick="switchTab('hints')" class="contenttab">${t('hints')}</div>
				<div id="tab-events" onclick="switchTab('events')" class="contenttab">${t('events')} (${eventLogs.length})</div>
				<div id="tab-status" onclick="switchTab('status')" class="contenttab activetab">${t('status')}</div>
			</div>
		</div>


		<div id="tab-content-status" class="tab-content" style="display:block;">
			<h3 style="text-align:center; margin:0 0 8px 0;">${t('zygomitesTitle')}</h3>

			<div class="possibleswrapper" style="max-height:350px; overflow-y:auto;">
				<div class="possibles">
					<table class="nistable solutiontable" style="width:100%; text-align:left;">
						<tr>
							<th style="width:75%">Name</th>
							<th style="width:25%; text-align:center">${t('captured')}</th>
						</tr>
						${zygomites.map((z, index) => `
							<tr id="zygomite-${index}" class="${z.catched ? 'targetfish' : ''}" onclick="TestApp.toggleZygomite('${z.name.replace(/'/g, "\\'")}')" style="cursor:pointer;">
								<td><span style="color:${z.catched ? '#9AE66E' : 'inherit'}">${z.name}</span></td>
								<td style="text-align:center;"><i class="bi ${z.catched ? 'bi-check-circle-fill' : 'bi-circle'}" style="color:${z.catched ? '#9AE66E' : 'inherit'}"></i></td>
							</tr>
						`).join('')}
					</table>
				</div>
			</div>
			<div class="suggestbar" style="justify-content:space-between; align-items:center; margin-top:6px;">
				<div class="suggestentry">
					<div class="suggesthead">${t('captured')}: </div>
					<div class="suggestvalue">${caughtCount}/${totalCount}</div>
				</div>
				<div style="display:flex; gap:4px;">
					${isMonitoring ? `
						<div onclick='TestApp.stopMonitoring()' class="menubutton nisbutton2" title="${t('stopMonitoring')}">
							<i class="bi bi-pause-fill"></i>
						</div>
					` : `
						<div onclick='TestApp.startMonitoring()' class="menubutton nisbutton2" title="${t('startMonitoring')}">
							<i class="bi bi-play-fill"></i>
						</div>
					`}
					${isResetConfirming ? `
						<div 
							id="reset-confirm-btn"
							onclick='TestApp.confirmReset()' 
							onmouseleave='TestApp.cancelReset()'
							class="menubutton nisbutton2" 
							title="${t('confirmResetTitle')}">
							<i class="bi bi-check-lg"></i>
						</div>
					` : `
						<div onclick='TestApp.resetZygomites()' class="menubutton nisbutton2" title="${t('reset')}">
							<i class="bi bi-arrow-clockwise"></i>
						</div>
					`}
					<div onclick='TestApp.toggleLanguage()' class="menubutton nisbutton2" title="${langButtonTitle}">
						<span class="${langButtonClass}" style="display:inline-block; height:16px; width:24px;"></span>
					</div>
				</div>
			</div>
			
		</div>

		<div id="tab-content-hints" class="tab-content" style="display:none;">
			<h3 style="margin:0 0 6px 0;">${t('hints')}</h3>
			<table class="nistable solutiontable" style="width:100%; text-align:left;">
				<tr>
					<td colspan="2" style="color:#45d1ff; font-weight:bold;">${t('hintGameEnglish')}</td>
				</tr>
				<tr><th>Action</th><th>Description</th></tr>
				<tr><td>Start</td><td>Click the play button to begin monitoring.</td></tr>
				<tr><td>Auto-detect</td><td>When you talk to a zygomite, its name is read and the row is marked.</td></tr>
				<tr><td>Manual mark</td><td>Click a row to toggle captured if auto-detect misses it.</td></tr>
				<tr><td>Reset</td><td>Use the reset button to clear all marks. Confirm appears next.</td></tr>
				<tr><td>Language</td><td>Click the flag to switch languages.</td></tr>
				<tr><td>Tips</td><td>Keep the NPC chatbox visible; enable pixel permission in Alt1.</td></tr>
			</table>
		</div>

		<div id="tab-content-events" class="tab-content" style="display:none;">
			<h3 style="margin:0 0 6px 0;">${t('eventLog')}</h3>
			<div id="events-list" style="max-height:400px; overflow-y:auto;">
				${renderEventsList()}
			</div>
		</div>
	`;
}

// Renderiza a lista de eventos
function renderEventsList(): string {
	if (eventLogs.length === 0) {
		return '<div class="p-5 text-center text-gray-400">Nenhum evento ainda</div>';
	}
	
	return eventLogs.slice().reverse().map(event => {
		const timeStr = event.timestamp.toLocaleTimeString();
		const colorMap = {
			success: 'text-emerald-500 border-emerald-500',
			info: 'text-blue-500 border-blue-500',
			warning: 'text-amber-500 border-amber-500',
			error: 'text-red-500 border-red-500'
		};
		const iconMap = {
			success: 'bi-check-circle-fill',
			info: 'bi-info-circle-fill',
			warning: 'bi-exclamation-triangle-fill',
			error: 'bi-x-circle-fill'
		};
		
		return `
			<div class="p-2 bg-gray-700 border-l-4 ${colorMap[event.type]} rounded flex items-center gap-2">
				<span class="text-gray-400 text-xs">[${timeStr}]</span>
				<i class="bi ${iconMap[event.type]} ${colorMap[event.type].split(' ')[0]}"></i>
				<span class="text-gray-200">${event.message}</span>
			</div>
		`;
	}).join('');
}

// Atualiza apenas a aba de eventos (mais eficiente que recriar toda a UI)
function updateEventsTab() {
	const eventsList = document.getElementById("events-list");
	const tabEvents = document.getElementById("tab-events");
	
	if (eventsList) {
		eventsList.innerHTML = renderEventsList();
		// Auto-scroll para o último evento
		eventsList.scrollTop = eventsList.scrollHeight;
	}
	
	if (tabEvents) {
		tabEvents.textContent = `${t('events')} (${eventLogs.length})`;
	}
}

// Função global para trocar de aba

(window as any).switchTab = 	function(tabName: 'status' | 'events' | 'hints') {
	// Atualiza botões
	const tabStatus = document.getElementById("tab-status");
	const tabEvents = document.getElementById("tab-events");
	const tabHints = document.getElementById("tab-hints");
	const contentStatus = document.getElementById("tab-content-status");
	const contentEvents = document.getElementById("tab-content-events");
	const contentHints = document.getElementById("tab-content-hints");
	
	if (tabName === 'status') {
		if (tabStatus) {
			tabStatus.className = "contenttab activetab";
			tabStatus.textContent = t('status');
		}
		if (tabEvents) {
			tabEvents.className = "contenttab";
			tabEvents.textContent = `${t('events')} (${eventLogs.length})`;
		}
		if (tabHints) tabHints.className = "contenttab";
		if (contentStatus) contentStatus.setAttribute('style', 'display:block;');
		if (contentEvents) contentEvents.setAttribute('style', 'display:none;');
		if (contentHints) contentHints.setAttribute('style', 'display:none;');
	} else if (tabName === 'events') {
		if (tabStatus) {
			tabStatus.className = "contenttab";
			tabStatus.textContent = t('status');
		}
		if (tabEvents) {
			tabEvents.className = "contenttab activetab";
			tabEvents.textContent = `${t('events')} (${eventLogs.length})`;
		}
		if (tabHints) tabHints.className = "contenttab";
		if (contentStatus) contentStatus.setAttribute('style', 'display:none;');
		if (contentEvents) contentEvents.setAttribute('style', 'display:block;');
		// Atualiza eventos quando a aba é aberta
		updateEventsTab();
	} else if (tabName === 'hints') {
		if (tabStatus) {
			tabStatus.className = "contenttab";
			tabStatus.textContent = t('status');
		}
		if (tabEvents) {
			tabEvents.className = "contenttab";
			tabEvents.textContent = `${t('events')} (${eventLogs.length})`;
		}
		if (tabHints) tabHints.className = "contenttab activetab";
		if (contentStatus) contentStatus.setAttribute('style', 'display:none;');
		if (contentEvents) contentEvents.setAttribute('style', 'display:none;');
		if (contentHints) contentHints.setAttribute('style', 'display:block;');
	}
};

function createStatusDiv(): HTMLElement {
	const div = document.createElement("div");
	div.id = "status";
	div.className = "p-4 bg-gray-800 rounded-lg";
	output.appendChild(div);
	return div;
}

// Usa o DialogReader do Alt1 diretamente, como outros plugins fazem
import DialogReader from "alt1/dialog";

// Detecta o título do diálogo na tela usando o DialogReader do Alt1
function readDialogueTitle(): string | null {
	if (!window.alt1 || !alt1.permissionPixel) {
		console.log("[DEBUG] Alt1 não disponível ou sem permissão");
		return null;
	}

	// Cria uma nova instância do DialogReader a cada chamada para evitar problemas de estado
	const dialogReader = new DialogReader();

	try {
		// Procura o diálogo na tela - precisa encontrar a cada vez
		const dialogPos = dialogReader.find();
		if (!dialogPos) {
			// Não loga sempre para não poluir o console quando não há diálogo aberto
			return null;
		}

		console.log("[DEBUG] Diálogo encontrado em:", dialogPos);

		// Captura a imagem do diálogo
		const imgref = dialogReader.ensureimg(null);
		if (!imgref) {
			console.log("[DEBUG] Não foi possível capturar imagem do diálogo");
			return null;
		}

		// Lê o título usando o método readTitle do DialogReader
		const title = dialogReader.readTitle(imgref);
		
		console.log("[DEBUG] Título lido pelo DialogReader:", title);
		
		if (title && title.trim()) {
			const detectedText = title.toLowerCase().trim();
			console.log("[DEBUG] ✓ Título detectado:", detectedText);
			return detectedText;
		}

		console.log("[DEBUG] Título vazio ou inválido");
		return null;
	} catch (e) {
		console.error("[DEBUG] Erro ao ler título com DialogReader:", e);
		return null;
	}
}

// Verifica se o título corresponde a alguma zygomita e marca como catched
function checkDialogue() {
	const title = readDialogueTitle();
	
	if (!title) {
		// Se não há título, limpa o último título para permitir detectar o mesmo NPC novamente
		if (lastDialogueTitle) {
			lastDialogueTitle = "";
		}
		return;
	}
	
	console.log("[DEBUG] checkDialogue: título encontrado:", title);

	// Se o texto mudou OU se é o mesmo texto mas já passou um tempo suficiente, processa
	// Isso permite detectar o mesmo NPC múltiplas vezes se necessário
	const isNewTitle = title !== lastDialogueTitle;
	
	if (isNewTitle) {
		lastDialogueTitle = title;
		
		// Normaliza o texto para comparação (remove espaços extras, converte para minúsculas)
		const normalizedTitle = title.toLowerCase().trim();
		
		// Debug: mostra tentativa de match
		console.log(`Buscando match para: "${normalizedTitle}"`);
		
		// Verifica se o título corresponde a alguma zygomita não capturada
		// Regras de matching (evita colisão entre "Ed", "Edd" e "Eddy"):
		// 1) Match exato (case-insensitive)
		// 2) Match por palavra inteira no título (tokenização simples)
		//    - Ex.: "talk to ed" → token "ed" casa somente com "Ed"
		//    - Evita que "ed" case com "edd"/"eddy" e vice-versa
		const titleTokens = normalizedTitle
			.replace(/[^a-z\s]/g, " ")
			.split(/\s+/)
			.filter(Boolean);

		for (const zygomite of zygomites) {
			const normalizedZygomite = zygomite.name.toLowerCase().trim();
			const isExact = normalizedTitle === normalizedZygomite;
			const isWord = titleTokens.includes(normalizedZygomite);
			const matches = isExact || isWord;
			
			if (!zygomite.catched && matches) {
				zygomite.catched = true;
				saveState();
				updateUI();
				updateNPCSelector();
				
				// Verifica se todas foram capturadas
				if (checkAllCaptured()) {
					
					// Mostra mensagem especial
					showOverlayQueued(
						currentLanguage === 'en' ? '🎉 All Zygomites Captured! 🎉' : '🎉 Todas as Zygomitas Capturadas! 🎉',
						a1lib.mixColor(245, 158, 11), // amarelo/laranja
						28,
						5000
					);
				}
				
				// Feedback visual no jogo (usando fila para evitar flood)
				showOverlayQueued(
					`${t('zygomiteFound')}: ${zygomite.name}!`,
					a1lib.mixColor(16, 185, 129), // verde
					24,
					3000
				);
				
				const detectedText = currentLanguage === 'en' ? 'detected' : 'detectado';
				const message = `<strong>✓ ${t('zygomiteCaught')}</strong> ${zygomite.name} (${detectedText}: "${title}")`;
				addEventLog(message, 'success');
				console.log(`✓ Match encontrado: ${zygomite.name} com "${title}"`);
				break;
			}
		}
	}
}

// Inicia o monitoramento do diálogo
export function startMonitoring() {
	if (isMonitoring) {
		addEventLog(t('monitoringActive'), 'warning');
		return;
	}

	if (!window.alt1) {
		addEventLog(t('needsAlt1'), 'error');
		return;
	}

	if (!alt1.permissionPixel) {
		addEventLog(t('noPixelPermission'), 'error');
		return;
	}

	isMonitoring = true;
	addEventLog(`<strong>${t('monitoringStarted')}</strong>`, 'info');
	
	// Mostra mensagem no centro da tela
	showOverlayQueued(
		currentLanguage === 'en' ? 'Monitoring Started' : 'Monitoramento Iniciado',
		a1lib.mixColor(16, 185, 129), // verde
		24,
		2000
	);
	
	updateUI(); // Atualiza a UI para mostrar o botão de pause
	
	// Verifica o diálogo a cada 100ms para detecção mais fluida e responsiva
	monitorInterval = setInterval(() => {
		checkDialogue();
	}, 100);
}

// Para o monitoramento
export function stopMonitoring() {
	if (!isMonitoring) {
		return;
	}

	isMonitoring = false;
	if (monitorInterval) {
		clearInterval(monitorInterval);
		monitorInterval = null;
	}
	
	addEventLog(t('monitoringStopped'), 'info');
	
	// Mostra mensagem no centro da tela
	showOverlayQueued(
		currentLanguage === 'en' ? 'Monitoring Stopped' : 'Monitoramento Parado',
		a1lib.mixColor(239, 68, 68), // vermelho
		24,
		2000
	);
	
	updateUI(); // Atualiza a UI para mostrar o botão de play
}

// Mostra confirmação do reset
export function resetZygomites() {
	isResetConfirming = true;
	updateUI();
}

// Confirma e executa o reset
export function confirmReset() {
	isResetConfirming = false;
	zygomites.forEach(z => z.catched = false);
	saveState();
	updateUI();
	// Limpa o último título detectado para permitir detectar novamente após reset
	lastDialogueTitle = "";
	updateNPCSelector();
	addEventLog(t('stateReset'), 'warning');
	
	// Mostra mensagem no centro da tela
	showOverlayQueued(
		t('resetCompleted'),
		a1lib.mixColor(245, 158, 11), // amarelo/laranja
		24,
		2000
	);
}

// Cancela a confirmação do reset
export function cancelReset() {
	isResetConfirming = false;
	updateUI();
}

// Marca uma zygomita manualmente pelo nome
export function markZygomiteManually(npcName: string) {
	const zygomite = zygomites.find(z => z.name.toLowerCase() === npcName.toLowerCase());
	if (zygomite && !zygomite.catched) {
		zygomite.catched = true;
		saveState();
		updateUI();
		updateNPCSelector();
		
		// Feedback visual no jogo (usando fila para evitar flood)
		showOverlayQueued(
			`✓ ${zygomite.name} marcada!`,
			a1lib.mixColor(16, 185, 129),
			24,
			3000
		);
		
		addEventLog(`<strong>✓ ${t('zygomiteMarked')}:</strong> ${zygomite.name}`, 'success');
		return true;
	} else if (!zygomite) {
		addEventLog(`${t('npnNotFound')}: ${npcName}`, 'error');
	} else if (zygomite.catched) {
		addEventLog(`${zygomite.name} ${t('alreadyMarked')}`, 'warning');
	}
	return false;
}

// Função de teste para debug - mostra visualmente a região sendo lida
export function testDialogueRead() {
	if (!window.alt1 || !alt1.permissionPixel) {
		addEventLog(t('alt1NotAvailable'), 'error');
		return;
	}

	const x = Math.round(alt1.rsWidth * 0.3);
	const y = Math.round(alt1.rsHeight * 0.67);
	const width = Math.round(alt1.rsWidth * 0.4);
	const height = 30;

	// Desenha um retângulo vermelho na região sendo lida
	alt1.overLayRect(
		a1lib.mixColor(255, 0, 0), // vermelho
		x,
		y,
		width,
		height,
		10000, // 10 segundos
		3
	);

	addEventLog(`🔴 Retângulo vermelho desenhado na região de leitura (${x}, ${y}, ${width}x${height})`, 'info');
	
	// Tenta ler e mostra resultado
	const text = readDialogueTitle();
	if (text) {
		addEventLog(`✓ Texto lido: "${text}"`, 'success');
	} else {
		addEventLog(`✗ Nenhum texto foi lido. Verifique o Console (F12) para detalhes.`, 'error');
	}
}

// Preenche o seletor de NPCs
// Funções mantidas para compatibilidade (seletor foi removido)
function populateNPCSelector() {
	// Não faz mais nada - funcionalidade movida para clique na lista
}

function updateNPCSelector() {
	// Não faz mais nada - funcionalidade movida para clique na lista
}

// Função para trocar idioma
export function toggleLanguage() {
	const order: Language[] = ['en', 'pt', 'es', 'de'];
	const idx = order.indexOf(currentLanguage);
	const next = order[(idx + 1) % order.length];
	currentLanguage = next;
	setLanguage(currentLanguage);
}

// Inicialização
loadState();
currentLanguage = loadLanguagePreference();
updateUI();

//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
	//tell alt1 about the app
	//this makes alt1 show the add app button when running inside the embedded browser
	//also updates app settings if they are changed
	alt1.identifyAppUrl("./appconfig.json");
} else {
	let addappurl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
	output.insertAdjacentHTML("beforeend", `
		<div class="p-4 bg-gray-800 rounded-lg my-4" style="text-align:center;">
			<a href='${addappurl}' style="text-decoration:none;" class="menubutton nisbutton2" style="display:inline-block; width:auto;">${t('addToAlt1Btn')}</a>
		</div>
	`);
}


