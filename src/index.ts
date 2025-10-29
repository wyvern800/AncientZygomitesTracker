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
			zygomite.catched ? `✓ ${zygomite.name} marcada!` : `○ ${zygomite.name} desmarcada`,
			zygomite.catched ? a1lib.mixColor(16, 185, 129) : a1lib.mixColor(156, 163, 175),
			24,
			2000
		);
		
		output.insertAdjacentHTML("beforeend", `<div style="color: ${zygomite.catched ? '#10b981' : '#9ca3af'};">
			${zygomite.catched ? '✓' : '○'} <strong>${zygomite.name}</strong> ${zygomite.catched ? 'marcada como capturada' : 'desmarcada'}
		</div>`);
	}
}

// Atualiza a interface visual
function updateUI() {
	const statusDiv = document.getElementById("status") || createStatusDiv();
	const caughtCount = zygomites.filter(z => z.catched).length;
	const totalCount = zygomites.length;
	
	statusDiv.innerHTML = `
		<h3>Zygomitas Antigas de Anachronia</h3>
		<p><strong>Capturadas:</strong> ${caughtCount}/${totalCount}</p>
		<p style="font-size: 11px; color: #9ca3af; margin: 5px 0;">
			💡 <strong>Dica:</strong> Clique no nome da zygomita para marcar/desmarcar manualmente
		</p>
		<div style="max-height: 350px; overflow-y: auto; margin-top: 10px;">
			${zygomites.map((z, index) => `
				<div 
					id="zygomite-${index}"
					onclick="TestApp.toggleZygomite('${z.name.replace(/'/g, "\\'")}')"
					style="padding: 8px; margin: 3px 0; ${z.catched ? 'background-color: #10b981; color: white;' : 'background-color: #374151; color: #e5e7eb;'} border-radius: 4px; cursor: pointer; transition: background-color 0.2s;"
					onmouseover="this.style.opacity='0.8'"
					onmouseout="this.style.opacity='1'"
				>
					${z.catched ? '✓' : '○'} ${z.name}
				</div>
			`).join('')}
		</div>
	`;
}

function createStatusDiv(): HTMLElement {
	const div = document.createElement("div");
	div.id = "status";
	div.style.cssText = "padding: 10px; margin: 10px 0; background-color: #1f2937; border-radius: 5px;";
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
			const debugDiv = document.getElementById("debug-text");
			if (debugDiv) {
				debugDiv.textContent = `Último texto detectado: ${detectedText}`;
			}
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
				
				output.insertAdjacentHTML("beforeend", `<div style="color: #10b981;"><strong>✓ Zygomita capturada:</strong> ${zygomite.name} (detectado: "${title}")</div>`);
				console.log(`✓ Match encontrado: ${zygomite.name} com "${title}"`);
				break;
			}
		}
	}
}

// Inicia o monitoramento do diálogo
export function startMonitoring() {
	if (isMonitoring) {
		output.insertAdjacentHTML("beforeend", `<div>Monitoramento já está ativo</div>`);
		return;
	}

	if (!window.alt1) {
		output.insertAdjacentHTML("beforeend", `<div style="color: #ef4444;">Você precisa executar isso no Alt1 para monitorar diálogos</div>`);
		return;
	}

	if (!alt1.permissionPixel) {
		output.insertAdjacentHTML("beforeend", `<div style="color: #ef4444;">Permissão de captura de pixels não está habilitada</div>`);
		return;
	}

	isMonitoring = true;
	output.insertAdjacentHTML("beforeend", `<div style="color: #10b981;"><strong>Monitoramento iniciado!</strong> Clique em NPCs para capturar zygomitas.</div>`);
	
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
	
	output.insertAdjacentHTML("beforeend", `<div>Monitoramento parado</div>`);
}

// Reseta todas as zygomitas
export function resetZygomites() {
	zygomites.forEach(z => z.catched = false);
	saveState();
	updateUI();
	// Limpa o último título detectado para permitir detectar novamente após reset
	lastDialogueTitle = "";
	updateNPCSelector();
	output.insertAdjacentHTML("beforeend", `<div style="color: #f59e0b;">Estado resetado - todas as zygomitas marcadas como não capturadas</div>`);
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
		
		output.insertAdjacentHTML("beforeend", `<div style="color: #10b981;"><strong>✓ Zygomita marcada manualmente:</strong> ${zygomite.name}</div>`);
		return true;
	} else if (!zygomite) {
		output.insertAdjacentHTML("beforeend", `<div style="color: #ef4444;">NPC não encontrado na lista: ${npcName}</div>`);
	} else if (zygomite.catched) {
		output.insertAdjacentHTML("beforeend", `<div style="color: #f59e0b;">${zygomite.name} já foi marcada anteriormente</div>`);
	}
	return false;
}

// Função de teste para debug - mostra visualmente a região sendo lida
export function testDialogueRead() {
	if (!window.alt1 || !alt1.permissionPixel) {
		output.insertAdjacentHTML("beforeend", `<div style="color: #ef4444;">Alt1 não disponível ou sem permissão</div>`);
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

	output.insertAdjacentHTML("beforeend", `<div style="color: #3b82f6;">🔴 Retângulo vermelho desenhado na região de leitura (${x}, ${y}, ${width}x${height})</div>`);
	
	// Tenta ler e mostra resultado
	const text = readDialogueTitle();
	if (text) {
		output.insertAdjacentHTML("beforeend", `<div style="color: #10b981;">✓ Texto lido: "${text}"</div>`);
	} else {
		output.insertAdjacentHTML("beforeend", `<div style="color: #ef4444;">✗ Nenhum texto foi lido. Verifique o Console (F12) para detalhes.</div>`);
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
		<div style="padding: 10px; background-color: #1f2937; border-radius: 5px; margin: 10px 0;">
			Alt1 não detectado, clique <a href='${addappurl}'>aqui</a> para adicionar este app ao Alt1
		</div>
	`);
}

// Interface inicial
output.insertAdjacentHTML("beforeend", `
	<div style="padding: 10px; background-color: #1f2937; border-radius: 5px; margin: 10px 0;">
		<h3 style="margin-top: 0;">Controle de Zygomitas</h3>
		<button onclick='TestApp.startMonitoring()' style="padding: 8px 16px; margin: 5px; background-color: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">
			Iniciar Monitoramento
		</button>
		<button onclick='TestApp.stopMonitoring()' style="padding: 8px 16px; margin: 5px; background-color: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
			Parar Monitoramento
		</button>
		<button onclick='TestApp.resetZygomites()' style="padding: 8px 16px; margin: 5px; background-color: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer;">
			Resetar
		</button>
		<div id="debug-text" style="font-size: 11px; color: #6b7280; margin-top: 10px; font-style: italic;">
			Último texto detectado: nenhum
		</div>
		<button onclick='TestApp.testDialogueRead()' style="padding: 8px 16px; margin: 5px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
			🧪 Testar Leitura (Debug)
		</button>
		<p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
			<strong>Nota:</strong> O plugin tentará ler automaticamente quando os métodos de OCR estiverem disponíveis.<br>
			<strong>Debug:</strong> Abra o Console (F12) para ver logs detalhados.
		</p>
	</div>
`);

