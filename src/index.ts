// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as a1lib from "alt1/base";
import * as OCR from "alt1/ocr";

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

// Sistema de log de eventos
interface EventLog {
	timestamp: Date;
	message: string;
	type: 'success' | 'info' | 'warning' | 'error';
}

var eventLogs: EventLog[] = [];
const MAX_EVENT_LOGS = 100; // Mantém apenas os últimos 100 eventos

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
		
		// Feedback visual no jogo (usando fila para evitar flood)
		showOverlayQueued(
			zygomite.catched ? `✓ ${zygomite.name} encontrado!` : `○ ${zygomite.name} desmarcada`,
			zygomite.catched ? a1lib.mixColor(16, 185, 129) : a1lib.mixColor(156, 163, 175),
			24,
			2000
		);
		
		const message = `${zygomite.catched ? '✓' : '○'} <strong>${zygomite.name}</strong> ${zygomite.catched ? 'marcada como capturada' : 'desmarcada'}`;
		addEventLog(message, zygomite.catched ? 'success' : 'info');
	}
}

// Atualiza a interface visual com sistema de abas
function updateUI() {
	const statusDiv = document.getElementById("status") || createStatusDiv();
	const caughtCount = zygomites.filter(z => z.catched).length;
	const totalCount = zygomites.length;
	
	statusDiv.innerHTML = `
		<div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-700">
			<div class="flex gap-2">
				<button id="tab-status" onclick="switchTab('status')" class="px-5 py-2 bg-emerald-500 text-white border-none rounded-t-lg cursor-pointer font-bold transition-colors hover:bg-emerald-600">
					Status
				</button>
				<button id="tab-events" onclick="switchTab('events')" class="px-5 py-2 bg-gray-700 text-gray-400 border-none rounded-t-lg cursor-pointer transition-colors hover:bg-gray-600 hover:text-gray-200">
					Eventos (${eventLogs.length})
				</button>
			</div>
			<div class="flex gap-2 items-center">
				<button onclick='TestApp.startMonitoring()' class="w-8 h-8 p-2 bg-emerald-500 text-white rounded cursor-pointer flex items-center justify-center transition-colors hover:bg-emerald-600" title="Iniciar Monitoramento">
					<i class="bi bi-play-fill"></i>
				</button>
				<button onclick='TestApp.stopMonitoring()' class="w-8 h-8 p-2 bg-red-500 text-white rounded cursor-pointer flex items-center justify-center transition-colors hover:bg-red-600" title="Parar Monitoramento">
					<i class="bi bi-pause-fill"></i>
				</button>
				<button onclick='TestApp.resetZygomites()' class="w-8 h-8 p-2 bg-amber-500 text-white rounded cursor-pointer flex items-center justify-center transition-colors hover:bg-amber-600" title="Resetar">
					<i class="bi bi-arrow-clockwise"></i>
				</button>
			</div>
		</div>
		
		<div id="tab-content-status" class="tab-content block">
			<h3 class="text-white text-center mt-0 mb-4 text-xl font-semibold">Zygomitas Antigas de Anachronia</h3>
			
			<div class="max-h-[350px] overflow-y-auto mt-2 space-y-2">
				${zygomites.map((z, index) => `
					<div 
						id="zygomite-${index}"
						onclick="TestApp.toggleZygomite('${z.name.replace(/'/g, "\\'")}')"
						class="px-3 py-2 rounded cursor-pointer flex justify-between items-center transition-all hover:opacity-80 ${z.catched ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}"
					>
						<span class="font-medium">${z.name}</span>
						<i class="bi ${z.catched ? 'bi-check-circle-fill' : 'bi-circle'}"></i>
					</div>
				`).join('')}
			</div>
			<p class="text-center mt-4 mb-0 text-white font-semibold">Capturadas: ${caughtCount}/${totalCount}</p>
		</div>
		
		<div id="tab-content-events" class="tab-content hidden">
			<h3 class="text-white text-lg font-semibold mb-2">Log de Eventos</h3>
			<div id="events-list" class="max-h-[400px] overflow-y-auto mt-2 space-y-2">
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
		tabEvents.textContent = `Eventos (${eventLogs.length})`;
	}
}

// Função global para trocar de aba
(window as any).switchTab = function(tabName: 'status' | 'events') {
	// Atualiza botões
	const tabStatus = document.getElementById("tab-status");
	const tabEvents = document.getElementById("tab-events");
	const contentStatus = document.getElementById("tab-content-status");
	const contentEvents = document.getElementById("tab-content-events");
	
	if (tabName === 'status') {
		if (tabStatus) {
			tabStatus.className = "px-5 py-2 bg-emerald-500 text-white border-none rounded-t-lg cursor-pointer font-bold transition-colors hover:bg-emerald-600";
		}
		if (tabEvents) {
			tabEvents.className = "px-5 py-2 bg-gray-700 text-gray-400 border-none rounded-t-lg cursor-pointer transition-colors hover:bg-gray-600 hover:text-gray-200";
		}
		if (contentStatus) contentStatus.className = "tab-content block";
		if (contentEvents) contentEvents.className = "tab-content hidden";
	} else {
		if (tabStatus) {
			tabStatus.className = "px-5 py-2 bg-gray-700 text-gray-400 border-none rounded-t-lg cursor-pointer transition-colors hover:bg-gray-600 hover:text-gray-200";
		}
		if (tabEvents) {
			tabEvents.className = "px-5 py-2 bg-emerald-500 text-white border-none rounded-t-lg cursor-pointer font-bold transition-colors hover:bg-emerald-600";
		}
		if (contentStatus) contentStatus.className = "tab-content hidden";
		if (contentEvents) contentEvents.className = "tab-content block";
		// Atualiza eventos quando a aba é aberta
		updateEventsTab();
	}
};

function createStatusDiv(): HTMLElement {
	const div = document.createElement("div");
	div.id = "status";
	div.className = "p-4 my-4 bg-gray-800 rounded-lg";
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
		for (const zygomite of zygomites) {
			const normalizedZygomite = zygomite.name.toLowerCase().trim();
			
			// Tenta diferentes formas de matching:
			// 1. Título contém o nome da zygomita
			// 2. Título é exatamente igual ao nome
			// 3. Nome contém o título (caso o OCR leia só parte)
			const matches = 
				normalizedTitle.includes(normalizedZygomite) ||
				normalizedTitle === normalizedZygomite ||
				normalizedZygomite.includes(normalizedTitle);
			
			if (!zygomite.catched && matches) {
				zygomite.catched = true;
				saveState();
				updateUI();
				updateNPCSelector();
				
				// Feedback visual no jogo (usando fila para evitar flood)
				showOverlayQueued(
					`Zygomita encontrada: ${zygomite.name}!`,
					a1lib.mixColor(16, 185, 129), // verde
					24,
					3000
				);
				
				const message = `<strong>✓ Zygomita capturada:</strong> ${zygomite.name} (detectado: "${title}")`;
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
		addEventLog("Monitoramento já está ativo", 'warning');
		return;
	}

	if (!window.alt1) {
		addEventLog("Você precisa executar isso no Alt1 para monitorar diálogos", 'error');
		return;
	}

	if (!alt1.permissionPixel) {
		addEventLog("Permissão de captura de pixels não está habilitada", 'error');
		return;
	}

	isMonitoring = true;
	addEventLog("<strong>Monitoramento iniciado!</strong> Clique em NPCs para capturar zygomitas.", 'info');
	
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
	
	addEventLog("Monitoramento parado", 'info');
}

// Reseta todas as zygomitas
export function resetZygomites() {
	zygomites.forEach(z => z.catched = false);
	saveState();
	updateUI();
	// Limpa o último título detectado para permitir detectar novamente após reset
	lastDialogueTitle = "";
	updateNPCSelector();
	addEventLog("Estado resetado - todas as zygomitas marcadas como não capturadas", 'warning');
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
		
		addEventLog(`<strong>✓ Zygomita marcada manualmente:</strong> ${zygomite.name}`, 'success');
		return true;
	} else if (!zygomite) {
		addEventLog(`NPC não encontrado na lista: ${npcName}`, 'error');
	} else if (zygomite.catched) {
		addEventLog(`${zygomite.name} já foi marcada anteriormente`, 'warning');
	}
	return false;
}

// Função de teste para debug - mostra visualmente a região sendo lida
export function testDialogueRead() {
	if (!window.alt1 || !alt1.permissionPixel) {
		addEventLog("Alt1 não disponível ou sem permissão", 'error');
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

// Inicialização
loadState();
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
		<div class="p-4 bg-gray-800 rounded-lg my-4">
			<p class="text-gray-200">Alt1 não detectado, clique <a href='${addappurl}' class="text-blue-400 hover:text-blue-300 underline">aqui</a> para adicionar este app ao Alt1</p>
		</div>
	`);
}

// Debug text - mantido para feedback, mas não precisa de seção separada

