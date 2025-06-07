const container = document.querySelector(".container");
const containercarrossel = container.querySelector(".container-carrossel");
const carrossel = container.querySelector(".carrossel");
const carrosselItems = carrossel.querySelectorAll(".carrossel-item");

// Iniciamos variáveis que irão mudar seu estado.
let isMouseDown = false;
let currentMousePos = 0;
let lastMousePos = 0;
let lastMoveTo = 0;
let moveTo = 0;

const createcarrossel = () => {
	const carrosselProps = onResize();
	const length = carrosselItems.length; // Comprimento do array
	const degress = 3600 / length; // Graus por cada item
	const gap = 100; // Espaço entre cada item
	const tz = distanceZ(carrosselProps.w, length, gap);

	const fov = calculateFov(carrosselProps);
	const height = calculateHeight(tz);

	container.style.width = tz * 2 + gap * length + "px";
	container.style.height = height + "px";

	carrosselItems.forEach((item, i) => {
		const degressByItem = degress * i + "deg";
		item.style.setProperty("--rotatey", degressByItem);
		item.style.setProperty("--tz", tz + "px");
	});
};

// Função que dá suavidade à animação
const lerp = (a, b, n) => {
	return n * (a - b) + b;
};

//https://3dtransforms.desandro.com/carousel
const distanceZ = (widthElement, length, gap) => {
	return widthElement / 2 / Math.tan(Math.PI / length) + gap; // Distância Z dos itens
};

//Calcula a altura do contêiner usando o campo de visão e a distância da perspectiva
const calculateHeight = (z) => {
	const t = Math.atan((90 * Math.PI) / 180 / 2);
	const height = t * 2 * z;

	return height;
};

//Calcula o campo de visão do carrossel
const calculateFov = (carrosselProps) => {
	const perspective = window
		.getComputedStyle(containercarrossel)
		.perspective.split("px")[0];

	const length =
		Math.sqrt(carrosselProps.w * carrosselProps.w) +
		Math.sqrt(carrosselProps.h * carrosselProps.h);
	const fov = 2 * Math.atan(length / (2 * perspective)) * (180 / Math.PI);
	return fov;
};

//Obtém a posição X e avalia se a posição é à direita ou à esquerda
const getPosX = (x) => {
	currentMousePos = x;

	moveTo = currentMousePos < lastMousePos ? moveTo - 2 : moveTo + 2;

	lastMousePos = currentMousePos;
};

const update = () => {
	lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
	carrossel.style.setProperty("--rotatey", lastMoveTo + "deg");

	requestAnimationFrame(update);
};

const onResize = () => {
	//Obtém as propriedades do tamanho do carrossel
	const boundingcarrossel = containercarrossel.getBoundingClientRect();

	const carrosselProps = {
		w: boundingcarrossel.width,
		h: boundingcarrossel.height,
	};

	return carrosselProps;
};

const initEvents = () => {
	//Eventos do mouse
	carrossel.addEventListener("mousedown", () => {
		isMouseDown = true;
		carrossel.style.cursor = "grabbing";
	});
	carrossel.addEventListener("mouseup", () => {
		isMouseDown = false;
		carrossel.style.cursor = "grab";
	});
	container.addEventListener("mouseleave", () => (isMouseDown = false));

	carrossel.addEventListener(
		"mousemove",
		(e) => isMouseDown && getPosX(e.clientX)
	);

	// Eventos de toque
	carrossel.addEventListener("touchstart", () => {
		isMouseDown = true;
		carrossel.style.cursor = "grabbing";
	});
	carrossel.addEventListener("touchend", () => {
		isMouseDown = false;
		carrossel.style.cursor = "grab";
	});
	container.addEventListener(
		"touchmove",
		(e) => isMouseDown && getPosX(e.touches[0].clientX)
	);

	window.addEventListener("resize", createcarrossel);

	update();
	createcarrossel();
};

initEvents();