window.__ModuleLoader__.load({
  id: "dsh-mindmap-live",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    
var MindElixir = (function () {
  var module = { exports: {} };
  var exports = module.exports;
  //#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, n = 0, r = 1, i = 2, a = 3, o = {
	name: "Latte",
	type: "light",
	palette: [
		"#dd7878",
		"#ea76cb",
		"#8839ef",
		"#e64553",
		"#fe640b",
		"#df8e1d",
		"#40a02b",
		"#209fb5",
		"#1e66f5",
		"#7287fd"
	],
	cssVar: {
		"--node-gap-x": "30px",
		"--node-gap-y": "10px",
		"--main-gap-x": "65px",
		"--main-gap-y": "45px",
		"--root-radius": "30px",
		"--main-radius": "20px",
		"--root-color": "#ffffff",
		"--root-bgcolor": "#4c4f69",
		"--root-border-color": "rgba(0, 0, 0, 0)",
		"--main-border": "",
		"--main-color": "#444446",
		"--main-bgcolor": "#ffffff",
		"--main-bgcolor-transparent": "rgba(255, 255, 255, 0.8)",
		"--topic-padding": "3px",
		"--color": "#777777",
		"--bgcolor": "#f6f6f6",
		"--selected": "#4dc4ff",
		"--accent-color": "#e64553",
		"--panel-color": "#444446",
		"--panel-bgcolor": "#ffffff",
		"--panel-border-color": "#eaeaea",
		"--map-padding": "50px 80px"
	}
}, s = {
	name: "Dark",
	type: "dark",
	palette: [
		"#848FA0",
		"#748BE9",
		"#D2F9FE",
		"#4145A5",
		"#789AFA",
		"#706CF4",
		"#EF987F",
		"#775DD5",
		"#FCEECF",
		"#DA7FBC"
	],
	cssVar: {
		"--node-gap-x": "30px",
		"--node-gap-y": "10px",
		"--main-gap-x": "65px",
		"--main-gap-y": "45px",
		"--root-radius": "30px",
		"--main-radius": "20px",
		"--root-color": "#ffffff",
		"--root-bgcolor": "#2d3748",
		"--root-border-color": "rgba(255, 255, 255, 0.1)",
		"--main-border": "",
		"--main-color": "#ffffff",
		"--main-bgcolor": "#4c4f69",
		"--main-bgcolor-transparent": "rgba(76, 79, 105, 0.8)",
		"--topic-padding": "3px",
		"--color": "#cccccc",
		"--bgcolor": "#252526",
		"--selected": "#4dc4ff",
		"--accent-color": "#789AFA",
		"--panel-color": "#ffffff",
		"--panel-bgcolor": "#2d3748",
		"--panel-border-color": "#696969",
		"--map-padding": "50px 80px"
	}
};
//#endregion
//#region src/utils/index.ts
function c(e) {
	return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
var l = function(e, t) {
	if (t.id === e) return t;
	if (t.children && t.children.length) {
		for (let n = 0; n < t.children.length; n++) {
			let r = l(e, t.children[n]);
			if (r) return r;
		}
		return null;
	}
	return null;
}, u = (e, t) => {
	if (e.parent = t, e.children) for (let t = 0; t < e.children.length; t++) u(e.children[t], e);
}, d = (e, t, n) => {
	if (e.expanded = t, e.children) if (n === void 0 || n > 0) {
		let r = n === void 0 ? void 0 : n - 1;
		e.children.forEach((e) => {
			d(e, t, r);
		});
	} else e.children.forEach((e) => {
		d(e, !1);
	});
};
function f(e) {
	if (e.id = m(), e.children) for (let t = 0; t < e.children.length; t++) f(e.children[t]);
}
function p(e, t, n, r) {
	let i = n - e, a = r - t, o = Math.atan2(a, i) * 180 / Math.PI, s = (o + 180 - 30) * Math.PI / 180, c = (o + 180 + 30) * Math.PI / 180;
	return {
		x1: n + Math.cos(s) * 12,
		y1: r + Math.sin(s) * 12,
		x2: n + Math.cos(c) * 12,
		y2: r + Math.sin(c) * 12
	};
}
function m() {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
var h = function() {
	let e = m();
	return {
		topic: this.newTopicName,
		id: e
	};
};
function g(e) {
	return JSON.parse(JSON.stringify(e, (e, t) => {
		if (e !== "parent") return t;
	}));
}
var _ = (e, t) => {
	let n = 0, r = 0;
	for (; t && t !== e;) n += t.offsetLeft, r += t.offsetTop, t = t.offsetParent;
	return {
		offsetLeft: n,
		offsetTop: r
	};
}, v = (e, t) => {
	for (let n in t) e.setAttribute(n, t[n]);
}, y = (e) => e ? e.classList.contains("me-tpc") : !1, b = (e) => {
	let t = new Set(e.map((e) => e.nodeObj));
	return e.filter((e) => e.nodeObj.parent).filter((e) => {
		let n = e.nodeObj.parent;
		for (; n;) {
			if (t.has(n)) return !1;
			n = n.parent;
		}
		return !0;
	});
}, x = (e) => {
	let t = e.match(/translate3d\(([^,]+),\s*([^,]+)/);
	return t ? {
		x: parseFloat(t[1]),
		y: parseFloat(t[2])
	} : {
		x: 0,
		y: 0
	};
}, S = function(e) {
	for (let t = 0; t < e.length; t++) {
		let { dom: n, evt: r, func: i } = e[t];
		n.addEventListener(r, i);
	}
	return function() {
		for (let t = 0; t < e.length; t++) {
			let { dom: n, evt: r, func: i } = e[t];
			n.removeEventListener(r, i);
		}
	};
}, C = (e, t) => {
	let n = e.x - t.x, r = e.y - t.y;
	return Math.sqrt(n * n + r * r);
}, w = function(e, t) {
	if (!t) return T(e), e;
	let n = e.querySelector(".insert-preview"), r = `insert-preview ${t} show`;
	return n || (n = document.createElement("div"), e.appendChild(n)), n.className = r, e;
}, T = function(e) {
	if (!e) return;
	let t = e.querySelectorAll(".insert-preview");
	for (let e of t || []) e.remove();
}, E = function(e, t) {
	for (let n of t) {
		let t = n.parentElement.parentElement.contains(e);
		if (!(e && e.classList.contains("me-tpc") && e !== n && !t && e.nodeObj.parent)) return !1;
	}
	return !0;
}, D = function(e) {
	let t = document.createElement("div");
	return t.className = "mind-elixir-ghost", e.container.appendChild(t), t;
}, O = class {
	mind;
	isMoving = !1;
	interval = null;
	speed = 20;
	constructor(e) {
		this.mind = e;
	}
	move(e, t) {
		this.isMoving || (this.isMoving = !0, this.interval = setInterval(() => {
			this.mind.move(e * this.speed * this.mind.scaleVal, t * this.speed * this.mind.scaleVal);
		}, 100));
	}
	stop() {
		this.isMoving = !1, this.interval &&= (clearInterval(this.interval), null);
	}
};
function ee(e) {
	return {
		isDragging: !1,
		insertType: null,
		meet: null,
		ghost: D(e),
		edgeMoveController: new O(e),
		startX: 0,
		startY: 0,
		pointerId: null
	};
}
var k = 5;
function te(e, t, n, r = !1) {
	if (e.spacePressed) return !1;
	let i = n.target;
	if (!i?.classList.contains("me-tpc") || !i.nodeObj.parent) return !1;
	if (t.startX = n.clientX, t.startY = n.clientY, t.pointerId = n.pointerId, e.dragged = e.currentNodes, r) {
		re(e, t);
		let r = e.container.getBoundingClientRect();
		ne(t.ghost, n.clientX - r.x, n.clientY - r.y);
	}
	return !0;
}
function ne(e, t, n) {
	e.style.transform = `translate(${t - 10}px, ${n - 10}px)`, e.style.display = "block";
}
function re(e, t) {
	let { dragged: n } = e;
	if (!n) return;
	let r = document.activeElement;
	r && r.isContentEditable && r.blur(), t.isDragging = !0, n.length > 1 ? t.ghost.innerHTML = n.length + "" : t.ghost.innerHTML = n[0].innerHTML;
	for (let e of n) e.parentElement.parentElement.style.opacity = "0.5";
	e.panHelper.clear();
}
function ie(e, t, n) {
	let { dragged: r } = e;
	if (!r || t.pointerId !== n.pointerId) return;
	let i = n.clientX - t.startX, a = n.clientY - t.startY, o = Math.sqrt(i * i + a * a);
	if (!t.isDragging && o > k && re(e, t), !t.isDragging) return;
	let s = e.container.getBoundingClientRect();
	ne(t.ghost, n.clientX - s.x, n.clientY - s.y), n.clientX < s.x + 50 ? t.edgeMoveController.move(1, 0) : n.clientX > s.x + s.width - 50 ? t.edgeMoveController.move(-1, 0) : n.clientY < s.y + 50 ? t.edgeMoveController.move(0, 1) : n.clientY > s.y + s.height - 50 ? t.edgeMoveController.move(0, -1) : t.edgeMoveController.stop(), T(t.meet);
	let c = 12 * e.scaleVal;
	if (e.direction === 3) {
		let e = document.elementFromPoint(n.clientX - c, n.clientY);
		if (E(e, r)) {
			t.meet = e;
			let r = e.getBoundingClientRect();
			t.insertType = n.clientX > r.x + r.width ? "after" : "in";
		} else {
			let e = document.elementFromPoint(n.clientX + c, n.clientY);
			if (E(e, r)) {
				t.meet = e;
				let r = e.getBoundingClientRect();
				t.insertType = n.clientX < r.x ? "before" : "in";
			} else t.insertType = null, t.meet = null;
		}
		t.meet && w(t.meet, t.insertType);
		return;
	}
	let l = document.elementFromPoint(n.clientX, n.clientY - c);
	if (E(l, r)) {
		t.meet = l;
		let e = l.getBoundingClientRect(), r = e.y;
		t.insertType = n.clientY > r + e.height ? "after" : "in";
	} else {
		let e = document.elementFromPoint(n.clientX, n.clientY + c);
		if (E(e, r)) {
			t.meet = e;
			let r = e.getBoundingClientRect().y;
			t.insertType = n.clientY < r ? "before" : "in";
		} else t.insertType = null, t.meet = null;
	}
	t.meet && w(t.meet, t.insertType);
}
function ae(e, t, n) {
	let { dragged: r } = e;
	if (!(!r || t.pointerId !== n.pointerId)) {
		t.edgeMoveController.stop();
		for (let e of r) e.parentElement.parentElement.style.opacity = "1";
		t.ghost.style.display = "none", t.ghost.innerHTML = "", t.isDragging && t.meet && (T(t.meet), t.insertType === "before" ? e.moveNodesBefore(r, t.meet) : t.insertType === "after" ? e.moveNodesAfter(r, t.meet) : t.insertType === "in" && e.moveNodesIn(r, t.meet)), e.dragged = null, t.isDragging = !1, t.insertType = null, t.meet = null, t.pointerId = null;
	}
}
function oe(e, t) {
	let { dragged: n } = e;
	if (n) {
		t.edgeMoveController.stop();
		for (let e of n) e.parentElement.parentElement.style.opacity = "1";
		t.meet && T(t.meet), t.ghost.style.display = "none", t.ghost.innerHTML = "", e.dragged = null, t.isDragging = !1, t.insertType = null, t.meet = null, t.pointerId = null;
	}
}
function se(e) {
	return () => {};
}
//#endregion
//#region src/types/index.ts
var A = {
	LHS: "lhs",
	RHS: "rhs",
	DOWN: "down"
}, ce = function() {
	this.nodes.innerHTML = "", this.nodes.classList.toggle("down", this.direction === 3);
	let e = this.createTopic(this.nodeData);
	fe.call(this, e, this.nodeData), e.draggable = !1;
	let t = document.createElement("div");
	t.className = "me-root", t.appendChild(e);
	let n = this.nodeData.children || [];
	if (this.direction === 2) {
		let e = 0, t = 0;
		n.map((n) => {
			n.direction === 0 ? e += 1 : n.direction === 1 ? t += 1 : e <= t ? (n.direction = 0, e += 1) : (n.direction = 1, t += 1);
		});
	}
	le(this, n, t);
}, le = function(e, t, n) {
	if (e.direction === 3) {
		let r = j(A.DOWN);
		for (let n = 0; n < t.length; n++) {
			let { grp: i } = e.createWrapper(t[n]);
			r.appendChild(i);
		}
		e.nodes.appendChild(n), e.nodes.appendChild(r), e.nodes.appendChild(e.lines), e.nodes.appendChild(e.labelContainer);
		return;
	}
	let r = j(A.LHS), i = j(A.RHS);
	for (let n = 0; n < t.length; n++) {
		let a = t[n], { grp: o } = e.createWrapper(a);
		e.direction === 2 ? a.direction === 0 ? r.appendChild(o) : i.appendChild(o) : e.direction === 0 ? r.appendChild(o) : i.appendChild(o);
	}
	e.nodes.appendChild(r), e.nodes.appendChild(n), e.nodes.appendChild(i), e.nodes.appendChild(e.lines), e.nodes.appendChild(e.labelContainer);
}, ue = function(e, t) {
	let n = document.createElement("div");
	n.className = "me-children";
	for (let r = 0; r < t.length; r++) {
		let i = t[r], { grp: a } = e.createWrapper(i);
		n.appendChild(a);
	}
	return n;
}, de = function(e, t) {
	let n = (this?.el ? this.el : t || document).querySelector(`[data-nodeid="me${e}"]`);
	if (!n) throw Error(`FindEle: Node ${e} not found, maybe it's collapsed.`);
	return n;
}, fe = function(e, t) {
	if (e.innerHTML = "", t.style) {
		let n = t.style;
		for (let t in n) e.style[t] = n[t];
	}
	if (t.dangerouslySetInnerHTML) {
		e.innerHTML = t.dangerouslySetInnerHTML;
		return;
	}
	if (t.image) {
		let n = t.image;
		if (n.url && n.width && n.height) {
			let t = document.createElement("img");
			t.src = this.imageProxy ? this.imageProxy(n.url) : n.url, t.style.width = n.width + "px", t.style.height = n.height + "px", n.fit && (t.style.objectFit = n.fit), e.appendChild(t), e.image = t;
		} else console.warn("Image url/width/height are required");
	} else e.image &&= void 0;
	{
		let n = document.createElement("span");
		n.className = "text", this.markdown ? n.innerHTML = this.markdown(t.topic, t) : n.textContent = t.topic, e.appendChild(n), e.text = n;
	}
	if (t.hyperLink) {
		let n = document.createElement("a");
		n.className = "hyper-link", n.target = "_blank", n.innerText = "🔗", n.href = t.hyperLink, e.appendChild(n), e.link = n;
	} else e.link &&= void 0;
	if (t.icons && t.icons.length) {
		let n = document.createElement("span");
		n.className = "icons", n.innerHTML = t.icons.map((e) => `<span>${c(e)}</span>`).join(""), e.appendChild(n), e.icons = n;
	} else e.icons &&= void 0;
	if (t.tags && t.tags.length) {
		let n = document.createElement("div");
		n.className = "tags", t.tags.forEach((e) => {
			let t = document.createElement("span");
			typeof e == "string" ? t.textContent = e : (t.textContent = e.text, e.className && (t.className = e.className), e.style && Object.assign(t.style, e.style)), n.appendChild(t);
		}), e.appendChild(n), e.tags = n;
	} else e.tags &&= void 0;
}, pe = function(e, t) {
	let n = document.createElement("div");
	n.className = "me-wrapper";
	let { p: r, tpc: i } = this.createParent(e);
	if (n.appendChild(r), !t && e.children && e.children.length > 0) {
		let t = N(e.expanded);
		if (r.appendChild(t), e.expanded !== !1) {
			let t = ue(this, e.children);
			n.appendChild(t);
		}
	}
	return {
		grp: n,
		top: r,
		tpc: i
	};
}, me = function(e) {
	let t = document.createElement("div");
	t.className = "me-parent";
	let n = this.createTopic(e);
	return fe.call(this, n, e), t.appendChild(n), {
		p: t,
		tpc: n
	};
}, he = function(e) {
	let t = document.createElement("div");
	return t.className = "me-children", t.append(...e), t;
}, ge = function(e) {
	let t = document.createElement("div");
	return t.className = "me-tpc", t.nodeObj = e, t.dataset.nodeid = "me" + e.id, t;
}, j = function(e) {
	let t = document.createElement("div");
	return t.className = `me-main ${e}`, t;
}, M = function(e) {
	let t = e.classList;
	return t.contains(A.DOWN) ? A.DOWN : t.contains(A.LHS) ? A.LHS : A.RHS;
};
function _e(e) {
	let t = document.createRange();
	t.selectNodeContents(e);
	let n = window.getSelection();
	n && (n.removeAllRanges(), n.addRange(t));
}
var ve = function(e) {
	if (!e) return;
	let t = document.createElement("div"), n = e.nodeObj, r = n.topic, { offsetLeft: i, offsetTop: a } = _(this.nodes, e);
	this.nodes.appendChild(t), t.id = "input-box", t.textContent = r, t.contentEditable = "plaintext-only", t.spellcheck = !1;
	let o = getComputedStyle(e);
	t.style.cssText = `
  left: ${i}px;
  top: ${a}px;
  min-width:${e.offsetWidth - 8}px;
  color:${o.color};
  font-size:${o.fontSize};
  padding:${o.padding};
  margin:${o.margin}; 
  background-color:${o.backgroundColor !== "rgba(0, 0, 0, 0)" && o.backgroundColor};
  border: ${o.border};
  border-radius:${o.borderRadius}; `, this.direction === 0 && (t.style.right = "0"), e.style.opacity = "0", _e(t), this.bus.fire("operation", {
		name: "beginEdit",
		target: e.nodeObj
	}), t.addEventListener("keydown", (e) => {
		if (e.stopPropagation(), e.isComposing) return;
		let n = e.key;
		if (n === "Enter" || n === "Tab") {
			if (e.shiftKey) return;
			e.preventDefault(), t.blur(), this.container.focus();
		} else n === "Escape" && (e.preventDefault(), t.textContent = r, t.blur(), this.container.focus());
	}), t.addEventListener("blur", () => {
		if (!t) return;
		e.style.opacity = "1";
		let i = t.innerText?.trim() || "";
		t.remove(), i !== r && i !== "" && (n.topic = i, this.markdown ? e.text.innerHTML = this.markdown(n.topic, n) : e.text.textContent = i, this.linkDiv(), this.bus.fire("operation", {
			name: "finishEdit",
			target: n,
			origin: r
		}));
	});
}, N = function(e) {
	let t = document.createElement("div");
	return t.className = "me-epd" + (e === !1 ? "" : " minus"), t.expanded = e !== !1, t;
}, P = (e) => {
	let t = e.parent?.children;
	return {
		siblings: t,
		index: t?.indexOf(e) ?? 0
	};
};
function ye(e) {
	let { siblings: t, index: n } = P(e);
	return t === void 0 ? 0 : (t.splice(n, 1), t.length);
}
function be(e, t, n) {
	let { siblings: r, index: i } = P(n);
	r !== void 0 && (t === "before" ? r.splice(i, 0, e) : r.splice(i + 1, 0, e));
}
function xe(e, t) {
	let { siblings: n, index: r } = P(e);
	n !== void 0 && (n[r] = t, t.children = [e]);
}
function Se(e, t, n) {
	if (ye(t), n.parent?.parent || (t.direction = n.direction), e === "in") n.children ? n.children.push(t) : n.children = [t];
	else {
		t.direction !== void 0 && (t.direction = n.direction);
		let { siblings: r, index: i } = P(n);
		if (r === void 0) return;
		e === "before" ? r.splice(i, 0, t) : r.splice(i + 1, 0, t);
	}
}
//#endregion
//#region src/utils/domManipulation.ts
var Ce = function({ map: e, direction: t }, n) {
	if (t === 0) return 0;
	if (t === 1) return 1;
	if (t === 3) return 3;
	if (t === 2) return (e.querySelector(".lhs")?.childElementCount || 0) <= (e.querySelector(".rhs")?.childElementCount || 0) ? (n.direction = 0, 0) : (n.direction = 1, 1);
}, we = function(e, t, n) {
	let r = n.children[0].children[0], i = t.parentElement;
	if (i.classList.contains("me-parent")) {
		if (F(r), i.children[1]) i.nextSibling.appendChild(n);
		else {
			let t = e.createChildren([n]);
			i.appendChild(N(!0)), i.insertAdjacentElement("afterend", t);
		}
		e.linkDiv(n.offsetParent);
	} else if (i.classList.contains("me-root")) {
		let t = Ce(e, r.nodeObj);
		t === 3 ? e.container.querySelector(".me-main.down")?.appendChild(n) : t === 0 ? e.container.querySelector(".lhs")?.appendChild(n) : e.container.querySelector(".rhs")?.appendChild(n), e.linkDiv();
	}
}, Te = function(e, t) {
	let n = e.parentNode;
	if (t === 0) {
		let e = n.parentNode.parentNode;
		e.classList.contains("me-main") || (e.previousSibling.children[1].remove(), e.remove());
	}
	n.parentNode.remove();
}, Ee = /* @__PURE__ */ t({
	addChild: () => Me,
	beginEdit: () => Ve,
	copyNodes: () => Ne,
	insertParent: () => je,
	insertSibling: () => Ae,
	moveDownNode: () => Ie,
	moveNodesAfter: () => Be,
	moveNodesBefore: () => ze,
	moveNodesIn: () => Re,
	moveUpNode: () => Fe,
	removeNodes: () => Le,
	reshapeNode: () => Oe,
	rmSubline: () => F,
	setNodeTopic: () => He
}), De = {
	before: "beforebegin",
	after: "afterend"
}, F = function(e) {
	let t = e.parentElement.parentElement.lastElementChild;
	t?.tagName === "svg" && t?.remove();
}, Oe = function(e, t) {
	let n = e.nodeObj, r = g(n);
	r.style && t.style && (t.style = Object.assign(r.style, t.style));
	let i = Object.assign(n, t);
	fe.call(this, e, i), this.linkDiv(), this.bus.fire("operation", {
		name: "reshapeNode",
		target: i,
		origin: r
	});
}, ke = function(e, t, n) {
	if (!t) return null;
	let r = t.nodeObj;
	r.expanded === !1 && (e.expandNode(t, !0), t = e.findEle(r.id));
	let i = n || e.generateNewObj();
	r.children ? r.children.push(i) : r.children = [i], u(e.nodeData);
	let { grp: a, top: o } = e.createWrapper(i);
	return we(e, t, a), {
		newTop: o,
		newNodeObj: i
	};
}, Ae = function(e, t, n) {
	let r = t || this.currentNode;
	if (!r) return;
	let i = r.nodeObj;
	if (!i.parent) {
		this.addChild();
		return;
	}
	if (!i.parent?.parent && this.direction === 2) {
		let e = this.map.querySelector(".lhs")?.childElementCount || 0, t = this.map.querySelector(".rhs")?.childElementCount || 0;
		if (!e || !t) {
			this.addChild(this.findEle(i.parent.id), n);
			return;
		}
	}
	let a = n || this.generateNewObj();
	i.parent?.parent || (a.direction = +!r.closest(".me-main").classList.contains(A.LHS)), be(a, e, i), u(this.nodeData);
	let o = r.parentElement, { grp: s, top: c } = this.createWrapper(a);
	o.parentElement.insertAdjacentElement(De[e], s), this.linkDiv(s.offsetParent), n || this.editTopic(c.firstChild), this.bus.fire("operation", {
		name: "insertSibling",
		position: e,
		target: a
	}), this.selectNode(c.firstChild, !0);
}, je = function(e, t) {
	let n = e || this.currentNode;
	if (!n) return;
	F(n);
	let r = n.nodeObj;
	if (!r.parent) return;
	let i = t || this.generateNewObj();
	r.parent?.parent || (i.direction = +!n.closest(".me-main").classList.contains(A.LHS)), xe(r, i), u(this.nodeData);
	let a = n.parentElement.parentElement, { grp: o, top: s } = this.createWrapper(i, !0);
	s.appendChild(N(!0)), a.insertAdjacentElement("afterend", o);
	let c = this.createChildren([a]);
	s.insertAdjacentElement("afterend", c), this.linkDiv(), t || this.editTopic(s.firstChild), this.bus.fire("operation", {
		name: "insertParent",
		target: i
	}), this.selectNode(s.firstChild, !0);
}, Me = function(e, t) {
	let n = e || this.currentNode;
	if (!n) return;
	let r = ke(this, n, t);
	if (!r) return;
	let { newTop: i, newNodeObj: a } = r;
	this.bus.fire("operation", {
		name: "addChild",
		target: a
	}), t || this.editTopic(i.firstChild), this.selectNode(i.firstChild, !0);
}, Ne = function(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r], a = g(i.nodeObj);
		f(a);
		let o = ke(this, t, a);
		if (!o) return;
		let { newNodeObj: s } = o;
		n.push(s);
	}
	this.bus.fire("operation", {
		name: "copyNodes",
		target: n
	}), this.unselectNodes(this.currentNodes), this.selectNodes(n.map((e) => this.findEle(e.id)));
}, Pe = function(e, t, n) {
	let r = t.parent?.children;
	if (r === void 0) return;
	let i = e.direction === 2 && !t.parent?.parent, a = (e) => !i || e.direction === t.direction, o, s = !1;
	for (let e of r) if (a(e)) {
		if (e === t) {
			if (n === -1) return o ? {
				to: o,
				type: "before"
			} : void 0;
			s = !0;
			continue;
		}
		if (s) return {
			to: e,
			type: "after"
		};
		o = e;
	}
}, Fe = function(e) {
	let t = e || this.currentNode;
	if (!t) return;
	let n = t.nodeObj;
	if (!n.parent) return;
	let r = Pe(this, n, -1);
	r && I([t], r.type, this.findEle(r.to.id), this);
}, Ie = function(e) {
	let t = e || this.currentNode;
	if (!t) return;
	let n = t.nodeObj;
	if (!n.parent) return;
	let r = Pe(this, n, 1);
	r && I([t], r.type, this.findEle(r.to.id), this);
}, Le = function(e) {
	if (e = b(e), e.length === 0) return;
	for (let t of e) {
		let e = t.nodeObj;
		Te(t, ye(e));
	}
	let t = e[e.length - 1];
	this.selectNode(this.findEle(t.nodeObj.parent.id)), this.linkDiv(), this.bus.fire("operation", {
		name: "removeNodes",
		target: e.map((e) => e.nodeObj)
	});
}, I = (e, t, n, r) => {
	e = b(e);
	let i = n.nodeObj;
	t === "in" && i.expanded === !1 && (r.expandNode(n, !0), n = r.findEle(i.id), i = n.nodeObj), t === "after" && (e = e.reverse());
	let a = /* @__PURE__ */ new Set();
	for (let o of e) {
		let e = o.nodeObj;
		if (Se(t, e, i), u(r.nodeData), t === "in") {
			let e = o.parentElement.parentElement, t = e.parentElement;
			we(r, n, e), a.add(t);
		} else {
			F(o);
			let e = o.parentElement.parentNode;
			a.add(e.parentElement), n.parentElement.parentNode.insertAdjacentElement(De[t], e);
		}
	}
	for (let e of a) e.childElementCount === 0 && !e.classList.contains("me-main") && (e.previousSibling.children[1].remove(), e.remove());
	r.linkDiv(), r.scrollIntoView(e[e.length - 1]);
	let o = t === "before" ? "moveNodesBefore" : t === "after" ? "moveNodesAfter" : "moveNodesIn";
	r.bus.fire("operation", {
		name: o,
		target: e.map((e) => e.nodeObj),
		destination: i
	});
}, Re = function(e, t) {
	I(e, "in", t, this);
}, ze = function(e, t) {
	I(e, "before", t, this);
}, Be = function(e, t) {
	I(e, "after", t, this);
}, Ve = function(e) {
	let t = e || this.currentNode;
	t && (t.nodeObj.dangerouslySetInnerHTML || this.editTopic(t));
}, He = function(e, t) {
	e.text.textContent = t, e.nodeObj.topic = t, this.linkDiv();
}, Ue = /* @__PURE__ */ t({
	cancelFocus: () => ct,
	clearSelection: () => Ye,
	disableEdit: () => et,
	enableEdit: () => $e,
	expandNode: () => pt,
	expandNodeAll: () => mt,
	focusNode: () => st,
	getData: () => Qe,
	getDataString: () => Ze,
	initDown: () => ft,
	initLeft: () => lt,
	initRight: () => ut,
	initSide: () => dt,
	install: () => ot,
	move: () => rt,
	refresh: () => ht,
	scale: () => tt,
	scaleFit: () => nt,
	scrollIntoView: () => Ge,
	selectNode: () => Ke,
	selectNodes: () => qe,
	stringifyData: () => Xe,
	toCenter: () => at,
	unselectNodes: () => Je
});
function We(e) {
	return {
		nodeData: e.isFocusMode ? e.nodeDataBackup : e.nodeData,
		arrows: e.arrows,
		summaries: e.summaries,
		direction: e.direction,
		theme: e.theme,
		compact: e.compact,
		meta: e.meta
	};
}
var Ge = function(e, t = !1) {
	let n = this.container, r = e.getBoundingClientRect(), i = n.getBoundingClientRect();
	if (t || r.top > i.bottom - 50 || r.bottom < i.top + 50 || r.left > i.right - 50 || r.right < i.left + 50) {
		let e = r.left + r.width / 2, t = r.top + r.height / 2, n = i.left + i.width / 2, a = i.top + i.height / 2, o = e - n, s = t - a;
		this.move(-o, -s, !0);
	}
}, Ke = function(e, t, n) {
	this.clearSelection(), this.scrollIntoView(e), this.selection?.select(e), t && this.bus.fire("selectNewNode", e.nodeObj);
}, qe = function(e) {
	this.selection?.select(e);
}, Je = function(e) {
	this.selection?.deselect(e);
}, Ye = function() {
	this.unselectNodes(this.currentNodes), this.unselectSummary(), this.unselectArrow();
}, Xe = function(e) {
	return JSON.stringify(e, (e, t) => {
		if (e !== "parent" || typeof t == "string") return t;
	});
}, Ze = function() {
	return Xe(We(this));
}, Qe = function() {
	return JSON.parse(this.getDataString());
}, $e = function() {
	this.editable = !0;
}, et = function() {
	this.editable = !1;
}, tt = function(e, t = {
	x: 0,
	y: 0
}) {
	if (e < this.scaleMin && e < this.scaleVal || e > this.scaleMax && e > this.scaleVal) return;
	let n = this.container.getBoundingClientRect(), r = t.x ? t.x - n.left - n.width / 2 : 0, i = t.y ? t.y - n.top - n.height / 2 : 0, { dx: a, dy: o } = it(this), s = this.map.style.transform, { x: c, y: l } = x(s), u = c - a, d = l - o, f = this.scaleVal, p = (-r + u) * (1 - e / f), m = (-i + d) * (1 - e / f);
	this.map.style.transform = `translate3d(${c - p}px, ${l - m}px, 0) scale(${e})`, this.scaleVal = e, this.bus.fire("scale", e);
}, nt = function() {
	let e = this.nodes.offsetHeight / this.container.offsetHeight, t = this.nodes.offsetWidth / this.container.offsetWidth, n = 1 / Math.max(1, Math.max(e, t));
	this.scaleVal = n;
	let { dx: r, dy: i } = it(this, !0);
	this.map.style.transform = `translate3d(${r}px, ${i}px, 0) scale(${n})`, this.bus.fire("scale", n);
}, rt = function(e, t, n = !1) {
	let { map: r, scaleVal: i, bus: a, container: o, nodes: s } = this;
	if (n && r.style.transition === "transform 0.3s") return !1;
	let c = r.style.transform, { x: l, y: u } = x(c), d = o.getBoundingClientRect(), f = s.getBoundingClientRect(), p = (d.left + d.right) / 2, m = (d.top + d.bottom) / 2;
	return e > 0 ? e = Math.min(e, Math.max(0, p - f.left)) : e < 0 && (e = Math.max(e, Math.min(0, p - f.right))), t > 0 ? t = Math.min(t, Math.max(0, m - f.top)) : t < 0 && (t = Math.max(t, Math.min(0, m - f.bottom))), e === 0 && t === 0 ? !1 : (l += e, u += t, n && (r.style.transition = "transform 0.3s", setTimeout(() => {
		r.style.transition = "none";
	}, 300)), r.style.transform = `translate3d(${l}px, ${u}px, 0) scale(${i})`, a.fire("move", {
		dx: e,
		dy: t
	}), !0);
}, it = (e, t = !1) => {
	let { container: n, map: r, nodes: i } = e, a, o;
	if (e.alignment === "nodes" || t || e.direction === 3) a = (n.offsetWidth - i.offsetWidth) / 2, o = (n.offsetHeight - i.offsetHeight) / 2, r.style.transformOrigin = "50% 50%";
	else {
		let e = r.querySelector(".me-root"), t = e.offsetTop, i = e.offsetLeft, s = e.offsetWidth, c = e.offsetHeight;
		a = n.offsetWidth / 2 - i - s / 2, o = n.offsetHeight / 2 - t - c / 2, r.style.transformOrigin = `${i + s / 2}px 50%`;
	}
	return {
		dx: a,
		dy: o
	};
}, at = function() {
	let { map: e, container: t } = this, { dx: n, dy: r } = it(this);
	t.scrollTop = 0, t.scrollLeft = 0, e.style.transform = `translate3d(${n}px, ${r}px, 0) scale(${this.scaleVal})`;
}, ot = function(e) {
	e(this);
}, st = function(e) {
	e.nodeObj.parent && (this.clearSelection(), this.tempDirection === null && (this.tempDirection = this.direction), this.isFocusMode ||= (this.nodeDataBackup = this.nodeData, !0), this.nodeData = e.nodeObj, this.initRight(), this.toCenter());
}, ct = function() {
	this.isFocusMode = !1, this.tempDirection !== null && (this.nodeData = this.nodeDataBackup, this.direction = this.tempDirection, this.tempDirection = null, this.refresh(), this.toCenter());
}, lt = function() {
	this.direction = 0, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, ut = function() {
	this.direction = 1, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, dt = function() {
	this.direction = 2, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, ft = function() {
	this.direction = 3, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, pt = function(e, t) {
	let n = e.nodeObj;
	n.expanded = typeof t == "boolean" ? t : n.expanded === !1;
	let r = e.getBoundingClientRect(), i = {
		x: r.left,
		y: r.top
	}, a = e.parentNode, o = a.children[1];
	if (o.expanded = n.expanded, o.className = "me-epd" + (n.expanded ? " minus" : ""), F(e), n.expanded) {
		let e = this.createChildren(n.children.map((e) => this.createWrapper(e).grp));
		a.parentNode.appendChild(e);
	} else a.parentNode.children[1].remove();
	this.linkDiv(e.closest(".me-main > .me-wrapper"));
	let s = e.getBoundingClientRect(), c = {
		x: s.left,
		y: s.top
	}, l = i.x - c.x, u = i.y - c.y;
	this.move(l, u), this.bus.fire("expandNode", n);
}, mt = function(e, t) {
	let n = e.nodeObj, r = e.getBoundingClientRect(), i = {
		x: r.left,
		y: r.top
	};
	d(n, t ?? !n.expanded), this.refresh();
	let a = this.findEle(n.id).getBoundingClientRect(), o = {
		x: a.left,
		y: a.top
	}, s = i.x - o.x, c = i.y - o.y;
	this.move(s, c);
}, ht = function(e) {
	this.clearSelection(), e && (e = JSON.parse(JSON.stringify(e)), this.nodeData = e.nodeData, this.arrows = e.arrows || [], this.summaries = e.summaries || [], e.meta && (this.meta = e.meta)), u(this.nodeData), this.layout(), this.linkDiv();
}, gt = "MIND-ELIXIR-WAIT-COPY", _t = 40, vt = 10, yt = ({ deltaMode: e, deltaY: t, viewportHeight: n }) => e === WheelEvent.DOM_DELTA_LINE ? t * _t : e === WheelEvent.DOM_DELTA_PAGE ? t * n : t, bt = ({ deltaMode: e, deltaY: t, scaleSensitivity: n, viewportHeight: r }) => {
	let i = -yt({
		deltaMode: e,
		deltaY: t,
		viewportHeight: r
	}) / vt * n;
	return Math.max(-n, Math.min(n, i));
}, xt = (e, t, n) => {
	t !== 0 && e.scale(e.scaleVal + t, n);
}, St = (e, t) => {
	let n = e.map.querySelectorAll(`.${t}>.me-wrapper>.me-parent>.me-tpc`);
	n.length !== 0 && e.selectNode(n[Math.ceil(n.length / 2) - 1]);
}, Ct = (e) => {
	e.selectNode(e.map.querySelector(".me-root>.me-tpc"));
}, wt = function(e, t) {
	let n = t.parentElement.parentElement.parentElement.previousSibling;
	if (n) {
		let t = n.firstChild;
		e.selectNode(t);
	}
}, Tt = function(e, t) {
	let n = t.parentElement.nextSibling;
	if (n && n.firstChild) {
		let t = n.firstChild.firstChild.firstChild;
		e.selectNode(t);
	}
}, Et = function(e, t) {
	let n = e.currentNode || e.currentNodes?.[0];
	if (!n) return;
	let r = n.nodeObj, i = n.offsetParent.offsetParent.parentElement;
	r.parent ? i.classList.contains(t) ? Tt(e, n) : r.parent?.parent ? wt(e, n) : Ct(e) : St(e, t);
}, L = function(e, t) {
	let n = e.currentNode;
	if (!n || !n.nodeObj.parent) return;
	let r = t + "Sibling", i = n.parentElement.parentElement[r];
	i ? e.selectNode(i.firstChild.firstChild) : e.selectNode(n);
}, Dt = function(e, t) {
	let n = t.nodeObj;
	n.parent && (n.parent.parent ? wt(e, t) : Ct(e));
}, Ot = function(e, t) {
	if (t.nodeObj.parent) Tt(e, t);
	else {
		let t = e.map.querySelectorAll(".down>.me-wrapper>.me-parent>.me-tpc");
		if (t.length === 0) return;
		e.selectNode(t[Math.ceil(t.length / 2) - 1]);
	}
}, kt = function(e, t, n) {
	xt(e, t === "in" ? e.scaleSensitivity : -e.scaleSensitivity, n);
}, At = (e, t) => {
	xt(e, bt({
		deltaMode: t.deltaMode,
		deltaY: t.deltaY,
		scaleSensitivity: e.scaleSensitivity,
		viewportHeight: e.container.clientHeight || window.innerHeight
	}), {
		x: t.clientX,
		y: t.clientY
	});
};
function jt(e, t) {
	t = t === !0 ? {} : t;
	let n = () => {
		e.currentArrow ? e.removeArrow() : e.currentSummary ? e.removeSummary(e.currentSummary.summaryObj.id) : e.currentNodes && e.removeNodes(e.currentNodes);
	}, r = !1, i = null, a = () => {
		r = !1, i &&= (clearTimeout(i), null), e.container.removeEventListener("keydown", o);
	}, o = (t) => {
		if ([
			"Control",
			"Meta",
			"Shift",
			"Alt"
		].includes(t.key)) return;
		let n = e.nodeData;
		if (!n.children?.length) {
			a();
			return;
		}
		let r = !0;
		if (t.key === "0") for (let e of n.children) d(e, !1);
		else if (t.key === "=") for (let e of n.children) d(e, !0);
		else if ([
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9"
		].includes(t.key)) for (let e of n.children) d(e, !0, Number(t.key) - 1);
		else r = !1;
		r && (e.refresh(), e.toCenter()), a();
	}, s = {
		Enter: (t) => {
			t.shiftKey ? e.insertSibling("before") : t.ctrlKey || t.metaKey ? e.insertParent() : e.insertSibling("after");
		},
		Tab: () => {
			e.addChild();
		},
		F1: () => {
			e.toCenter();
		},
		F2: () => {
			e.currentSummary ? e.editSummary(e.currentSummary) : e.currentArrow ? e.editArrowLabel(e.currentArrow) : e.beginEdit();
		},
		ArrowUp: (t) => {
			if (t.altKey) e.moveUpNode();
			else if (t.metaKey || t.ctrlKey) return e.initSide();
			else if (e.direction === 3) {
				let t = e.currentNode || e.currentNodes?.[0];
				t && Dt(e, t);
			} else L(e, "previous");
		},
		ArrowDown: (t) => {
			if (t.altKey) e.moveDownNode();
			else if (e.direction === 3) {
				let t = e.currentNode || e.currentNodes?.[0];
				t && Ot(e, t);
			} else L(e, "next");
		},
		ArrowLeft: (t) => {
			if (t.metaKey || t.ctrlKey) return e.initLeft();
			e.direction === 3 ? L(e, "previous") : Et(e, A.LHS);
		},
		ArrowRight: (t) => {
			if (t.metaKey || t.ctrlKey) return e.initRight();
			e.direction === 3 ? L(e, "next") : Et(e, A.RHS);
		},
		PageUp: () => e.moveUpNode(),
		PageDown: () => {
			e.moveDownNode();
		},
		"=": (t) => {
			(t.metaKey || t.ctrlKey) && kt(e, "in");
		},
		"-": (t) => {
			(t.metaKey || t.ctrlKey) && kt(e, "out");
		},
		0: (t) => {
			if (t.metaKey || t.ctrlKey) {
				if (r) return;
				e.scale(1);
			}
		},
		k: (t) => {
			(t.metaKey || t.ctrlKey) && (a(), r = !0, i = window.setTimeout(() => {
				i = null, a();
			}, 2e3), e.container.addEventListener("keydown", o));
		},
		Delete: n,
		Backspace: n,
		...t
	};
	e.container.onkeydown = (t) => {
		if ((t.ctrlKey || t.metaKey) && [
			"c",
			"v",
			"x"
		].includes(t.key) || t.preventDefault(), !e.editable) return;
		let n = s[t.key];
		n && n(t);
	};
	let c = (t) => {
		if (t.target instanceof HTMLElement && t.target.id === "input-box" || e.currentNodes.length === 0) return !1;
		if (t.clipboardData) {
			let n = Xe({
				magic: gt,
				data: b(e.currentNodes).map((e) => e.nodeObj)
			});
			return t.clipboardData.setData("text/plain", n), t.preventDefault(), !0;
		}
		return !1;
	};
	e.container.addEventListener("copy", c), e.container.addEventListener("cut", (e) => {
		c(e) && n();
	}), e.container.addEventListener("paste", (t) => {
		let n = t.clipboardData?.getData("text/plain");
		if (n) try {
			let r = JSON.parse(n);
			if (r && r.magic === gt && Array.isArray(r.data)) {
				let n = r.data, i = n.map((e) => ({ nodeObj: e }));
				n.length > 0 && e.currentNode && (e.copyNodes(i, e.currentNode), t.preventDefault());
				return;
			}
		} catch {}
		e.pasteHandler && e.pasteHandler(t);
	});
}
//#endregion
//#region src/mouse.ts
function Mt(e) {
	let { panHelper: t, container: n } = e, r = null;
	e.spacePressed = !1;
	let i = {
		lastTap: 0,
		lastTapTarget: null,
		DOUBLE_CLICK_THRESHOLD: 300,
		detect(e, t) {
			if (e.button !== 0) {
				this.clear();
				return;
			}
			let n = (/* @__PURE__ */ new Date()).getTime(), r = n - this.lastTap, i = r < this.DOUBLE_CLICK_THRESHOLD && r > 0 && this.lastTapTarget === e.target;
			this.lastTap = n, this.lastTapTarget = e.target, i && t(e);
		},
		clear() {
			this.lastTap = 0, this.lastTapTarget = null;
		}
	}, a = {
		Idle: 0,
		Pinch: 1,
		DragWait: 2,
		Drag: 3,
		Pan: 4,
		BoxSelect: 5
	};
	e.ptState = a.Idle;
	let o = {
		lastDistance: null,
		activePointers: /* @__PURE__ */ new Map(),
		handlePointerDown(e) {
			if (e.pointerType !== "touch") return !1;
			if (this.activePointers.set(e.pointerId, {
				x: e.clientX,
				y: e.clientY
			}), this.activePointers.size >= 2) {
				let [e, t] = Array.from(this.activePointers.values());
				return this.lastDistance = C(e, t), !0;
			}
			return !1;
		},
		handlePointerMove(t) {
			if (t.pointerType !== "touch" || !this.activePointers.has(t.pointerId)) return !1;
			if (this.activePointers.set(t.pointerId, {
				x: t.clientX,
				y: t.clientY
			}), this.activePointers.size >= 2) {
				let [t, n] = Array.from(this.activePointers.values()), r = C(t, n);
				if (this.lastDistance !== null && this.lastDistance > 0) {
					let i = r / this.lastDistance;
					e.scale(e.scaleVal * i, {
						x: (t.x + n.x) / 2,
						y: (t.y + n.y) / 2
					});
				}
				return this.lastDistance = r, !0;
			}
			return !1;
		},
		handlePointerUp(e) {
			e.pointerType === "touch" && (this.activePointers.delete(e.pointerId), this.activePointers.size < 2 && (this.lastDistance = null));
		},
		clear() {
			this.activePointers.clear(), this.lastDistance = null;
		}
	}, s = ee(e), c = {
		timer: null,
		startPos: null,
		pointerId: null,
		DURATION: 500,
		MOVE_THRESHOLD: 10,
		clear() {
			this.timer !== null && (clearTimeout(this.timer), this.timer = null, this.startPos = null, this.pointerId = null);
		},
		start(e, t) {
			this.timer = window.setTimeout(() => {
				t(e), this.timer = null, this.startPos = null, this.pointerId = null;
			}, this.DURATION), this.startPos = {
				x: e.clientX,
				y: e.clientY
			}, this.pointerId = e.pointerId;
		},
		handleMove(e) {
			if (this.timer !== null && this.startPos !== null && e.pointerId === this.pointerId) {
				let t = e.clientX - this.startPos.x, n = e.clientY - this.startPos.y;
				Math.sqrt(t * t + n * n) > this.MOVE_THRESHOLD && this.clear();
			}
		}
	}, l = (t, n) => {
		if (t.closest("#input-box")) return !1;
		let r = t.closest(".svg-label"), i = t.closest(".topiclinks, .summary"), a = r ? {
			type: r.dataset.type,
			element: document.getElementById(r.dataset.svgId)
		} : i ? {
			type: i.classList.contains("topiclinks") ? "arrow" : "summary",
			element: t.closest("g")
		} : null;
		if (!a?.type || !a?.element) return !1;
		let { type: o, element: s } = a;
		return e.clearSelection(), o === "arrow" ? n ? e.editArrowLabel(s) : e.selectArrow(s) : n ? e.editSummary(s) : e.selectSummary(s), !0;
	}, u = (n) => {
		if (n.pointerType === "mouse" && n.button !== 0) return;
		if (e.helper1?.moved) {
			e.helper1.clear();
			return;
		}
		if (e.helper2?.moved) {
			e.helper2.clear();
			return;
		}
		if (t.moved) {
			t.clear();
			return;
		}
		if (s?.isDragging) return;
		let r = n.target;
		r.classList.contains("me-epd") && (n.ctrlKey || n.metaKey ? e.expandNodeAll(r.previousSibling) : e.expandNode(r.previousSibling));
	}, d = (t) => {
		if (!e.editable) return;
		let n = t.target;
		if (y(n)) {
			e.selectNode(n), e.beginEdit(n);
			return;
		}
		l(n, !0);
	}, f = (n) => {
		if (n.pointerType === "touch" && o.handlePointerDown(n)) {
			e.ptState = a.Pinch, c.clear(), t.clear(), (s.isDragging || s.pointerId !== null) && oe(e, s);
			return;
		}
		if (e.ptState === a.Pinch) return;
		let i = n.target;
		if (e.editable && i.className === "map-container" && n.button === 0 && n.pointerType === "mouse") {
			e.ptState = a.BoxSelect;
			return;
		}
		if (t.handlePointerDown(n), t.mousedown && (e.ptState = a.Pan), n.button === 0 || n.pointerType === "touch") if (y(i)) {
			e.selection?.cancel();
			let t = e.currentNodes || [];
			if (n.ctrlKey || n.metaKey || e.mobileMultiSelect ? t.includes(i) ? r = i : ((e.currentArrow || e.currentSummary) && e.clearSelection(), e.selection?.select(i)) : t.includes(i) || e.selectNode(i), !e.editable) return;
			n.pointerType === "touch" ? (e.ptState = a.DragWait, c.start(n, (t) => {
				te(e, s, t, !0) && (e.ptState = a.Drag, i.setPointerCapture(t.pointerId));
			})) : te(e, s, n, !1) && (e.ptState = a.Drag, i.setPointerCapture(n.pointerId));
		} else l(i, !1);
	}, p = (n) => {
		switch (e.ptState) {
			case a.Pinch:
				o.handlePointerMove(n);
				break;
			case a.DragWait:
				c.handleMove(n), c.timer === null && (e.ptState = a.Pan, t.handlePointerMove(n));
				break;
			case a.Drag:
				ie(e, s, n);
				break;
			case a.Pan: t.handlePointerMove(n);
		}
	}, m = (e) => {
		e.preventDefault(), window.removeEventListener("contextmenu", m, !0);
	}, h = (n) => {
		n.pointerType === "touch" && o.handlePointerUp(n);
		let l = s.isDragging, u = t.moved;
		switch (e.ptState) {
			case a.DragWait:
				c.clear();
				break;
			case a.Drag:
				ae(e, s, n);
				break;
			case a.Pan: t.handlePointerUp(n), t.moved && n.button === 2 && n.pointerType === "mouse" && (window.addEventListener("contextmenu", m, {
				capture: !0,
				once: !0
			}), setTimeout(() => window.removeEventListener("contextmenu", m, !0), 300));
		}
		i.detect(n, d), (e.ptState !== a.Pinch || o.activePointers.size < 2) && (e.ptState = a.Idle), r &&= (!l && !u && e.selection?.deselect(r), null);
	}, g = () => {
		o.clear(), c.clear(), t.clear(), i.clear(), (s.isDragging || s.pointerId !== null) && oe(e, s), e.ptState = a.Idle, r = null;
	};
	return S([
		{
			dom: n,
			evt: "pointerdown",
			func: f
		},
		{
			dom: n,
			evt: "pointermove",
			func: p
		},
		{
			dom: n,
			evt: "pointerup",
			func: h
		},
		{
			dom: n,
			evt: "pointercancel",
			func: g
		},
		{
			dom: n,
			evt: "click",
			func: u
		},
		{
			dom: n,
			evt: "contextmenu",
			func: (t) => {
				t.preventDefault(), t.button === 2 && e.editable && setTimeout(() => {
					if (e.panHelper.moved || e.ptState !== a.Idle && e.ptState !== a.Pan) return;
					let n = t.target;
					y(n) && !n.classList.contains("selected") && e.selectNode(n), e.bus.fire("showContextMenu", t);
				}, 200);
			}
		},
		{
			dom: n,
			evt: "wheel",
			func: typeof e.handleWheel == "function" ? e.handleWheel : (t) => {
				if (t.ctrlKey || t.metaKey) return t.stopPropagation(), t.preventDefault(), At(e, t);
				(t.shiftKey ? e.move(-t.deltaY, 0) : e.move(-t.deltaX, -t.deltaY)) && (t.stopPropagation(), t.preventDefault());
			}
		},
		{
			dom: n,
			evt: "blur",
			func: g
		},
		{
			dom: n,
			evt: "keydown",
			func: (t) => {
				t.code === "Space" && (e.spacePressed = !0, e.container.classList.add("space-pressed"));
			}
		},
		{
			dom: n,
			evt: "keyup",
			func: (t) => {
				t.code === "Space" && (e.spacePressed = !1, e.container.classList.remove("space-pressed"));
			}
		}
	]);
}
//#endregion
//#region src/utils/pubsub.ts
function Nt() {
	return {
		handlers: {},
		addListener: function(e, t) {
			this.handlers[e] === void 0 && (this.handlers[e] = []), this.handlers[e].push(t);
		},
		fire: function(e, ...t) {
			if (this.handlers[e] instanceof Array) {
				let n = this.handlers[e];
				for (let e = 0; e < n.length; e++) n[e](...t);
			}
		},
		removeListener: function(e, t) {
			if (!this.handlers[e]) return;
			let n = this.handlers[e];
			if (!t) n.length = 0;
			else if (n.length) for (let r = 0; r < n.length; r++) n[r] === t && this.handlers[e].splice(r, 1);
		}
	};
}
//#endregion
//#region src/utils/svg.ts
var R = "http://www.w3.org/2000/svg", z = function(e) {
	let t = e.clientWidth, n = e.clientHeight, r = e.dataset, i = Number(r.x), a = Number(r.y), o = r.anchor, s = i;
	o === "middle" ? s = i - t / 2 : o === "end" && (s = i - t), e.style.left = `${s}px`, e.style.top = `${a - n / 2}px`, e.style.visibility = "visible";
}, B = function(e, t, n, r) {
	let { anchor: i = "middle", color: a, dataType: o, svgId: s } = r, c = document.createElement("div");
	return c.className = "svg-label", c.style.color = a || "#666", c.id = "label-" + s, c.innerHTML = e, c.dataset.type = o, c.dataset.svgId = s, c.dataset.x = t.toString(), c.dataset.y = n.toString(), c.dataset.anchor = i, c;
}, Pt = function(e, t, n) {
	let r = document.createElementNS(R, "path");
	return v(r, {
		d: e,
		stroke: t || "#666",
		fill: "none",
		"stroke-width": n
	}), r;
}, V = function(e) {
	let t = document.createElementNS(R, "svg");
	return t.setAttribute("class", e), t.setAttribute("overflow", "visible"), t;
}, Ft = function() {
	let e = document.createElementNS(R, "line");
	return e.setAttribute("stroke", "#4dc4ff"), e.setAttribute("fill", "none"), e.setAttribute("stroke-width", "2"), e.setAttribute("opacity", "0.45"), e;
}, It = function(e, t, n, r) {
	let i = document.createElementNS(R, "g");
	return [
		{
			name: "line",
			d: e
		},
		{
			name: "arrow1",
			d: t
		},
		{
			name: "arrow2",
			d: n
		}
	].forEach((e, t) => {
		let n = e.d, a = document.createElementNS(R, "path"), o = {
			d: n,
			stroke: r?.stroke || "rgb(227, 125, 116)",
			fill: "none",
			"stroke-width": String(r?.strokeWidth || "2")
		};
		r?.opacity !== void 0 && (o.opacity = String(r.opacity)), v(a, o), t === 0 && a.setAttribute("stroke-dasharray", r?.strokeDasharray || "8,2");
		let s = document.createElementNS(R, "path");
		v(s, {
			d: n,
			stroke: "transparent",
			fill: "none",
			"stroke-width": "15"
		}), i.appendChild(s), i.appendChild(a), i[e.name] = a;
	}), i;
}, Lt = function(e, t, n) {
	if (!t) return;
	let r = n.label;
	t.style.opacity = "0";
	let i = t.cloneNode(!0);
	e.nodes.appendChild(i), i.id = "input-box", i.textContent = r, i.contentEditable = "plaintext-only", i.spellcheck = !1, i.style.cssText = `
    left:${t.style.left};
    top:${t.style.top}; 
    max-width: 200px;
  `, _e(i), e.scrollIntoView(i), i.addEventListener("keydown", (t) => {
		if (t.stopPropagation(), t.isComposing) return;
		let n = t.key;
		if (n === "Enter" || n === "Tab") {
			if (t.shiftKey) return;
			t.preventDefault(), i.blur(), e.container.focus();
		}
	}), i.addEventListener("blur", () => {
		if (!i) return;
		let a = i.innerText?.trim() || "";
		n.label = a === "" ? r : a, t.style.opacity = "1", i.remove(), a !== r && (e.markdown ? t.innerHTML = e.markdown(n.label, n) : t.textContent = n.label, z(t), "parent" in n ? e.bus.fire("operation", {
			name: "finishEditSummary",
			target: n
		}) : e.bus.fire("operation", {
			name: "finishEditArrowLabel",
			target: n
		}));
	});
}, Rt = function(e) {
	let t = this.map.querySelector(".me-root"), n = t.offsetTop, r = t.offsetLeft, i = t.offsetWidth, a = t.offsetHeight, o = this.map.querySelectorAll(".me-main > .me-wrapper");
	this.lines.innerHTML = "";
	for (let t = 0; t < o.length; t++) {
		let s = o[t], c = s.querySelector(".me-tpc"), { offsetLeft: l, offsetTop: u } = _(this.nodes, c), d = c.offsetWidth, f = c.offsetHeight, p = M(s.parentNode), m = this.generateMainBranch({
			pT: n,
			pL: r,
			pW: i,
			pH: a,
			cT: u,
			cL: l,
			cW: d,
			cH: f,
			direction: p,
			containerHeight: this.nodes.offsetHeight,
			containerWidth: this.nodes.offsetWidth
		}), h = this.theme.palette, g = c.nodeObj.branchColor || h[t % h.length];
		if (c.style.borderColor = g, this.lines.appendChild(Pt(m, g, "3")), e && e !== s) continue;
		let v = V("subLines"), y = s.lastChild;
		y.tagName === "svg" && y.remove(), s.appendChild(v), zt(this, v, g, s, p, !0);
	}
	this.labelContainer.innerHTML = "", this.renderArrow(), this.renderSummary(), this.bus.fire("linkDiv");
}, zt = function(e, t, n, r, i, a) {
	let o = r.firstChild, s = r.children[1].children;
	if (s.length === 0) return;
	let c = o.offsetTop, l = o.offsetLeft, u = o.offsetWidth, d = o.offsetHeight;
	for (let r = 0; r < s.length; r++) {
		let o = s[r], f = o.firstChild, p = f.offsetTop, m = f.offsetLeft, h = f.offsetWidth, g = f.offsetHeight, _ = f.firstChild.nodeObj.branchColor || n, v = e.generateSubBranch({
			pT: c,
			pL: l,
			pW: u,
			pH: d,
			cT: p,
			cL: m,
			cW: h,
			cH: g,
			direction: i,
			isFirst: a
		});
		t.appendChild(Pt(v, _, "2"));
		let y = f.children[1];
		if (y) {
			if (!y.expanded) continue;
		} else continue;
		zt(e, t, _, o, i);
	}
}, Bt = {
	addChild: "Add child",
	addParent: "Add parent",
	addSibling: "Add sibling",
	removeNode: "Remove node",
	focus: "Focus Mode",
	cancelFocus: "Cancel Focus Mode",
	moveUp: "Move up",
	moveDown: "Move down",
	link: "Link",
	linkBidirectional: "Bidirectional Link",
	clickTips: "Please click the target node",
	summary: "Summary"
};
//#endregion
//#region src/plugin/contextMenu.ts
function Vt(e, t) {
	let n = {
		focus: !0,
		link: !0,
		locale: Bt
	};
	t = t === !0 ? n : Object.assign(n, t);
	let r = (e) => {
		let t = document.createElement("div");
		return t.innerText = e, t.className = "tips", t;
	}, i = (e, t, n) => {
		let r = document.createElement("li");
		return r.id = e, r.innerHTML = `<span>${c(t)}</span><span ${n ? "class=\"key\"" : ""}>${c(n)}</span>`, r;
	}, a = t.locale, o = i("cm-add_child", a.addChild, "Tab"), s = i("cm-add_parent", a.addParent, "Ctrl + Enter"), l = i("cm-add_sibling", a.addSibling, "Enter"), u = i("cm-remove_child", a.removeNode, "Delete"), d = i("cm-fucus", a.focus, ""), f = i("cm-unfucus", a.cancelFocus, ""), p = i("cm-up", a.moveUp, "PgUp"), m = i("cm-down", a.moveDown, "Pgdn"), h = i("cm-link", a.link, ""), g = i("cm-link-bidirectional", a.linkBidirectional, ""), _ = i("cm-summary", a.summary, ""), v = document.createElement("ul");
	if (v.className = "menu-list", v.appendChild(o), v.appendChild(s), v.appendChild(l), v.appendChild(u), t.focus && (v.appendChild(d), v.appendChild(f)), v.appendChild(p), v.appendChild(m), v.appendChild(_), t.link && (v.appendChild(h), v.appendChild(g)), t && t.extend) for (let e = 0; e < t.extend.length; e++) {
		let n = t.extend[e], r = i(n.name, n.name, n.key || "");
		v.appendChild(r), r.onclick = (e) => {
			n.onclick(e);
		};
	}
	let b = document.createElement("div");
	b.className = "context-menu", b.appendChild(v), b.hidden = !0, e.container.append(b);
	let x = !0;
	e.bus.addListener("showContextMenu", (e) => {
		let t = e.target;
		if (y(t)) {
			x = !!t.parentElement.classList.contains("me-root"), x ? (d.className = "disabled", p.className = "disabled", m.className = "disabled", s.className = "disabled", l.className = "disabled", u.className = "disabled") : (d.className = "", p.className = "", m.className = "", s.className = "", l.className = "", u.className = ""), b.hidden = !1, v.style.top = "", v.style.bottom = "", v.style.left = "", v.style.right = "";
			let n = v.offsetHeight, r = v.offsetWidth, i = v.getBoundingClientRect(), a = e.clientY - i.top, o = e.clientX - i.left;
			n + a > window.innerHeight ? (v.style.top = "", v.style.bottom = "0px") : (v.style.bottom = "", v.style.top = a + 15 + "px"), r + o > window.innerWidth ? (v.style.left = "", v.style.right = "0px") : (v.style.right = "", v.style.left = o + 10 + "px");
		}
	}), b.onclick = (e) => {
		e.target === b && (b.hidden = !0);
	}, o.onclick = () => {
		e.addChild(), b.hidden = !0;
	}, s.onclick = () => {
		e.insertParent(), b.hidden = !0;
	}, l.onclick = () => {
		x || (e.insertSibling("after"), b.hidden = !0);
	}, u.onclick = () => {
		x || (e.removeNodes(e.currentNodes || []), b.hidden = !0);
	}, d.onclick = () => {
		x || (e.focusNode(e.currentNode), b.hidden = !0);
	}, f.onclick = () => {
		e.cancelFocus(), b.hidden = !0;
	}, p.onclick = () => {
		x || (e.moveUpNode(), b.hidden = !0);
	}, m.onclick = () => {
		x || (e.moveDownNode(), b.hidden = !0);
	};
	let S = (t) => {
		b.hidden = !0;
		let n = e.currentNode, i = r(a.clickTips);
		e.container.appendChild(i), e.map.addEventListener("click", (r) => {
			r.preventDefault(), i.remove();
			let a = r.target;
			(a.parentElement.classList.contains("me-parent") || a.parentElement.classList.contains("me-root")) && e.createArrow(n, a, t);
		}, { once: !0 });
	};
	return h.onclick = () => S(), g.onclick = () => S({ bidirectional: !0 }), _.onclick = () => {
		b.hidden = !0, e.createSummary(), e.unselectNodes(e.currentNodes);
	}, () => {
		o.onclick = null, s.onclick = null, l.onclick = null, u.onclick = null, d.onclick = null, f.onclick = null, p.onclick = null, m.onclick = null, h.onclick = null, _.onclick = null, b.onclick = null, e.container.oncontextmenu = null;
	};
}
//#endregion
//#region src/plugin/operationHistory.ts
var Ht = function(e) {
	switch (e.name) {
		case "createSummary":
		case "finishEditSummary":
		case "removeSummary": return {
			type: "summary",
			value: e.target.id
		};
		case "createArrow":
		case "finishEditArrowLabel":
		case "removeArrow":
		case "reshapeArrow": return {
			type: "arrow",
			value: e.target.id
		};
		case "removeNodes":
		case "copyNodes":
		case "moveNodesBefore":
		case "moveNodesAfter":
		case "moveNodesIn": return {
			type: "nodes",
			value: e.target.map((e) => e.id)
		};
		default: return {
			type: "nodes",
			value: [e.target.id]
		};
	}
};
function Ut(e) {
	let t = [], n = -1, r = e.getData(), i = [];
	e.undo = function() {
		if (n > -1) {
			let i = t[n];
			r = i.prev, e.refresh(i.prev);
			try {
				i.currentTarget.type === "nodes" && (i.operation === "removeNodes" ? e.selectNodes(i.currentTarget.value.map((e) => this.findEle(e))) : e.selectNodes(i.currentSelected.map((e) => this.findEle(e))));
			} catch {} finally {
				n--;
			}
		}
	}, e.redo = function() {
		if (n < t.length - 1) {
			n++;
			let i = t[n];
			r = i.next, e.refresh(i.next);
			try {
				i.currentTarget.type === "nodes" && (i.operation === "removeNodes" ? e.selectNodes(i.currentSelected.map((e) => this.findEle(e))) : e.selectNodes(i.currentTarget.value.map((e) => this.findEle(e))));
			} catch {}
		}
	}, e.clearHistory = function() {
		t = [], n = -1, r = e.getData(), e.clearSelection();
	};
	let a = function(a) {
		if (a.name === "beginEdit") return;
		t = t.slice(0, n + 1);
		let o = e.getData(), s = {
			prev: r,
			operation: a.name,
			currentSelected: i.map((e) => e.id),
			currentTarget: Ht(a),
			next: o
		};
		t.push(s), r = o, n = t.length - 1;
	}, o = function(t) {
		if (!e.editable || !t.metaKey && !t.ctrlKey) return;
		let n = t.key.toLowerCase();
		n === "z" ? t.shiftKey ? e.redo() : e.undo() : n === "y" && e.redo();
	}, s = function() {
		i = e.currentNodes.map((e) => e.nodeObj);
	};
	return e.bus.addListener("operation", a), e.bus.addListener("selectNodes", s), e.bus.addListener("unselectNodes", s), e.container.addEventListener("keydown", o), () => {
		e.bus.removeListener("operation", a), e.bus.removeListener("selectNodes", s), e.bus.removeListener("unselectNodes", s), e.container.removeEventListener("keydown", o);
	};
}
//#endregion
//#region src/plugin/toolBar.ts
var Wt = {
	side: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1750169394918\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2021\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"200\" height=\"200\"><path d=\"M851.91168 328.45312c-59.97056 0-108.6208 48.47104-108.91264 108.36992l-137.92768 38.4a109.14304 109.14304 0 0 0-63.46752-46.58688l1.39264-137.11872c47.29344-11.86816 82.31936-54.66624 82.31936-105.64096 0-60.15488-48.76288-108.91776-108.91776-108.91776s-108.91776 48.76288-108.91776 108.91776c0 49.18784 32.60928 90.75712 77.38368 104.27392l-1.41312 138.87488a109.19936 109.19936 0 0 0-63.50336 48.55808l-138.93632-39.48544 0.01024-0.72704c0-60.15488-48.76288-108.91776-108.91776-108.91776s-108.91776 48.75776-108.91776 108.91776c0 60.15488 48.76288 108.91264 108.91776 108.91264 39.3984 0 73.91232-20.92032 93.03552-52.2496l139.19232 39.552-0.00512 0.2304c0 25.8304 9.00096 49.5616 24.02816 68.23424l-90.14272 132.63872a108.7488 108.7488 0 0 0-34.2528-5.504c-60.15488 0-108.91776 48.768-108.91776 108.91776 0 60.16 48.76288 108.91776 108.91776 108.91776 60.16 0 108.92288-48.75776 108.92288-108.91776 0-27.14624-9.9328-51.968-26.36288-71.04l89.04704-131.03104a108.544 108.544 0 0 0 37.6832 6.70208 108.672 108.672 0 0 0 36.48512-6.272l93.13792 132.57216a108.48256 108.48256 0 0 0-24.69888 69.0688c0 60.16 48.768 108.92288 108.91776 108.92288 60.16 0 108.91776-48.76288 108.91776-108.92288 0-60.14976-48.75776-108.91776-108.91776-108.91776a108.80512 108.80512 0 0 0-36.69504 6.3488l-93.07136-132.48a108.48768 108.48768 0 0 0 24.79616-72.22784l136.09984-37.888c18.99008 31.93856 53.84192 53.3504 93.69088 53.3504 60.16 0 108.92288-48.75776 108.92288-108.91264-0.00512-60.15488-48.77312-108.92288-108.92288-108.92288z\" p-id=\"2022\"></path></svg>",
	left: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1750169375313\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1775\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"200\" height=\"200\"><path d=\"M639 463.30000001L639 285.1c0-36.90000001-26.4-68.5-61.3-68.5l-150.2 0c-1.5 0-3 0.1-4.5 0.3-10.2-38.7-45.5-67.3-87.5-67.3-50 0-90.5 40.5-90.5 90.5s40.5 90.5 90.5 90.5c42 0 77.3-28.6 87.5-67.39999999 1.4 0.3 2.9 0.4 4.5 0.39999999L577.7 263.6c6.8 0 14.3 8.9 14.3 21.49999999l0 427.00000001c0 12.7-7.40000001 21.5-14.30000001 21.5l-150.19999999 0c-1.5 0-3 0.2-4.5 0.4-10.2-38.8-45.5-67.3-87.5-67.3-50 0-90.5 40.5-90.5 90.4 0 49.9 40.5 90.6 90.5 90.59999999 42 0 77.3-28.6 87.5-67.39999999 1.4 0.2 2.9 0.4 4.49999999 0.4L577.7 780.7c34.80000001 0 61.3-31.6 61.3-68.50000001L639 510.3l79.1 0c10.4 38.5 45.49999999 67 87.4 67 50 0 90.5-40.5 90.5-90.5s-40.5-90.5-90.5-90.5c-41.79999999 0-77.00000001 28.4-87.4 67L639 463.30000001z\" fill=\"currentColor\" p-id=\"1776\"></path></svg>",
	right: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1750169667709\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"3037\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"200\" height=\"200\"><path d=\"M385 560.69999999L385 738.9c0 36.90000001 26.4 68.5 61.3 68.5l150.2 0c1.5 0 3-0.1 4.5-0.3 10.2 38.7 45.5 67.3 87.5 67.3 50 0 90.5-40.5 90.5-90.5s-40.5-90.5-90.5-90.5c-42 0-77.3 28.6-87.5 67.39999999-1.4-0.3-2.9-0.4-4.5-0.39999999L446.3 760.4c-6.8 0-14.3-8.9-14.3-21.49999999l0-427.00000001c0-12.7 7.40000001-21.5 14.30000001-21.5l150.19999999 0c1.5 0 3-0.2 4.5-0.4 10.2 38.8 45.5 67.3 87.5 67.3 50 0 90.5-40.5 90.5-90.4 0-49.9-40.5-90.6-90.5-90.59999999-42 0-77.3 28.6-87.5 67.39999999-1.4-0.2-2.9-0.4-4.49999999-0.4L446.3 243.3c-34.80000001 0-61.3 31.6-61.3 68.50000001L385 513.7l-79.1 0c-10.4-38.5-45.49999999-67-87.4-67-50 0-90.5 40.5-90.5 90.5s40.5 90.5 90.5 90.5c41.79999999 0 77.00000001-28.4 87.4-67L385 560.69999999z\" fill=\"currentColor\" p-id=\"3038\"></path></svg>",
	full: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1750169402629\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2170\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"200\" height=\"200\"><path d=\"M639.328 416c8.032 0 16.096-3.008 22.304-9.056l202.624-197.184-0.8 143.808c-0.096 17.696 14.144 32.096 31.808 32.192 0.064 0 0.128 0 0.192 0 17.6 0 31.904-14.208 32-31.808l1.248-222.208c0-0.672-0.352-1.248-0.384-1.92 0.032-0.512 0.288-0.896 0.288-1.408 0.032-17.664-14.272-32-31.968-32.032L671.552 96l-0.032 0c-17.664 0-31.968 14.304-32 31.968C639.488 145.632 653.824 160 671.488 160l151.872 0.224-206.368 200.8c-12.672 12.32-12.928 32.608-0.64 45.248C622.656 412.736 630.976 416 639.328 416z\" p-id=\"2171\"></path><path d=\"M896.032 639.552 896.032 639.552c-17.696 0-32 14.304-32.032 31.968l-0.224 151.872-200.832-206.4c-12.32-12.64-32.576-12.96-45.248-0.64-12.672 12.352-12.928 32.608-0.64 45.248l197.184 202.624-143.808-0.8c-0.064 0-0.128 0-0.192 0-17.6 0-31.904 14.208-32 31.808-0.096 17.696 14.144 32.096 31.808 32.192l222.24 1.248c0.064 0 0.128 0 0.192 0 0.64 0 1.12-0.32 1.76-0.352 0.512 0.032 0.896 0.288 1.408 0.288l0.032 0c17.664 0 31.968-14.304 32-31.968L928 671.584C928.032 653.952 913.728 639.584 896.032 639.552z\" p-id=\"2172\"></path><path d=\"M209.76 159.744l143.808 0.8c0.064 0 0.128 0 0.192 0 17.6 0 31.904-14.208 32-31.808 0.096-17.696-14.144-32.096-31.808-32.192L131.68 95.328c-0.064 0-0.128 0-0.192 0-0.672 0-1.248 0.352-1.888 0.384-0.448 0-0.8-0.256-1.248-0.256 0 0-0.032 0-0.032 0-17.664 0-31.968 14.304-32 31.968L96 352.448c-0.032 17.664 14.272 32 31.968 32.032 0 0 0.032 0 0.032 0 17.664 0 31.968-14.304 32-31.968l0.224-151.936 200.832 206.4c6.272 6.464 14.624 9.696 22.944 9.696 8.032 0 16.096-3.008 22.304-9.056 12.672-12.32 12.96-32.608 0.64-45.248L209.76 159.744z\" p-id=\"2173\"></path><path d=\"M362.368 617.056l-202.624 197.184 0.8-143.808c0.096-17.696-14.144-32.096-31.808-32.192-0.064 0-0.128 0-0.192 0-17.6 0-31.904 14.208-32 31.808l-1.248 222.24c0 0.704 0.352 1.312 0.384 2.016 0 0.448-0.256 0.832-0.256 1.312-0.032 17.664 14.272 32 31.968 32.032L352.448 928c0 0 0.032 0 0.032 0 17.664 0 31.968-14.304 32-31.968s-14.272-32-31.968-32.032l-151.936-0.224 206.4-200.832c12.672-12.352 12.96-32.608 0.64-45.248S375.008 604.704 362.368 617.056z\" p-id=\"2174\"></path></svg>",
	living: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1750169573443\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2883\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"200\" height=\"200\"><path d=\"M514.133333 488.533333m-106.666666 0a106.666667 106.666667 0 1 0 213.333333 0 106.666667 106.666667 0 1 0-213.333333 0Z\" fill=\"currentColor\" p-id=\"2884\"></path><path d=\"M512 64C264.533333 64 64 264.533333 64 512c0 236.8 183.466667 428.8 416 445.866667v-134.4c-53.333333-59.733333-200.533333-230.4-200.533333-334.933334 0-130.133333 104.533333-234.666667 234.666666-234.666666s234.666667 104.533333 234.666667 234.666666c0 61.866667-49.066667 153.6-145.066667 270.933334l-59.733333 68.266666V960C776.533333 942.933333 960 748.8 960 512c0-247.466667-200.533333-448-448-448z\" fill=\"currentColor\" p-id=\"2885\"></path></svg>",
	zoomin: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1750169419447\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2480\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"200\" height=\"200\"><path d=\"M863.328 482.56l-317.344-1.12L545.984 162.816c0-17.664-14.336-32-32-32s-32 14.336-32 32l0 318.4L159.616 480.064c-0.032 0-0.064 0-0.096 0-17.632 0-31.936 14.24-32 31.904C127.424 529.632 141.728 544 159.392 544.064l322.592 1.152 0 319.168c0 17.696 14.336 32 32 32s32-14.304 32-32l0-318.944 317.088 1.12c0.064 0 0.096 0 0.128 0 17.632 0 31.936-14.24 32-31.904C895.264 496.992 880.96 482.624 863.328 482.56z\" p-id=\"2481\"></path></svg>",
	zoomout: "<?xml version=\"1.0\" standalone=\"no\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg t=\"1750169426515\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2730\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"200\" height=\"200\"><path d=\"M863.744 544 163.424 544c-17.664 0-32-14.336-32-32s14.336-32 32-32l700.32 0c17.696 0 32 14.336 32 32S881.44 544 863.744 544z\" p-id=\"2731\"></path></svg>"
}, H = (e, t) => {
	let n = document.createElement("span");
	return n.id = e, n.innerHTML = Wt[t], n;
};
function Gt(e) {
	let t = document.createElement("div"), n = H("fullscreen", "full"), r = H("toCenter", "living"), i = H("zoomout", "zoomout"), a = H("zoomin", "zoomin");
	t.appendChild(n), t.appendChild(r), t.appendChild(i), t.appendChild(a), t.className = "mind-elixir-toolbar rb";
	let o = null, s = () => {
		let t = e.container.getBoundingClientRect(), n = x(e.map.style.transform), r = t.width / 2, i = t.height / 2;
		o = {
			containerRect: t,
			currentTransform: n,
			mapCenterX: (r - n.x) / e.scaleVal,
			mapCenterY: (i - n.y) / e.scaleVal
		};
	};
	return e.el.addEventListener("fullscreenchange", () => {
		if (o) {
			let t = e.container.getBoundingClientRect(), n = t.width / 2, r = t.height / 2, i = n - o.mapCenterX * e.scaleVal, a = r - o.mapCenterY * e.scaleVal, s = i - o.currentTransform.x, c = a - o.currentTransform.y;
			e.move(s, c);
		}
	}), n.onclick = () => {
		s(), document.fullscreenElement === e.el ? document.exitFullscreen() : e.el.requestFullscreen();
	}, r.onclick = () => {
		e.toCenter();
	}, i.onclick = () => {
		e.scale(e.scaleVal - e.scaleSensitivity);
	}, a.onclick = () => {
		e.scale(e.scaleVal + e.scaleSensitivity);
	}, t;
}
function Kt(e) {
	let t = document.createElement("div"), n = H("tbltl", "left"), r = H("tbltr", "right"), i = H("tblts", "side");
	return t.appendChild(n), t.appendChild(r), t.appendChild(i), t.className = "mind-elixir-toolbar lt", n.onclick = () => {
		e.initLeft();
	}, r.onclick = () => {
		e.initRight();
	}, i.onclick = () => {
		e.initSide();
	}, t;
}
function qt(e) {
	e.container.append(Gt(e)), e.container.append(Kt(e));
}
//#endregion
//#region src/viselect/src/EventEmitter.ts
var Jt = class {
	_listeners = /* @__PURE__ */ new Map();
	addEventListener(e, t) {
		let n = this._listeners.get(e) ?? /* @__PURE__ */ new Set();
		return this._listeners.set(e, n), n.add(t), this;
	}
	removeEventListener(e, t) {
		return this._listeners.get(e)?.delete(t), this;
	}
	dispatchEvent(e, ...t) {
		let n = !0;
		for (let r of this._listeners.get(e) ?? []) n = r(...t) !== !1 && n;
		return n;
	}
	unbindAllListeners() {
		this._listeners.clear();
	}
	on = this.addEventListener;
	off = this.removeEventListener;
	emit = this.dispatchEvent;
}, Yt = (e, t = "px") => typeof e == "number" ? e + t : e, U = ({ style: e }, t, n) => {
	if (typeof t == "object") for (let [n, r] of Object.entries(t)) r !== void 0 && (e[n] = Yt(r));
	else n !== void 0 && (e[t] = Yt(n));
}, Xt = (e = 0, t = 0, n = 0, r = 0) => {
	let i = {
		x: e,
		y: t,
		width: n,
		height: r,
		top: t,
		left: e,
		right: e + n,
		bottom: t + r
	}, a = () => JSON.stringify(i);
	return {
		...i,
		toJSON: a
	};
}, Zt = (e) => {
	let t, n = -1, r = !1;
	return {
		next: (...i) => {
			t = i, r || (r = !0, n = requestAnimationFrame(() => {
				e(...t), r = !1;
			}));
		},
		cancel: () => {
			cancelAnimationFrame(n), r = !1;
		}
	};
}, Qt = (e, t, n = "touch") => {
	switch (n) {
		case "center": {
			let n = t.left + t.width / 2, r = t.top + t.height / 2;
			return n >= e.left && n <= e.right && r >= e.top && r <= e.bottom;
		}
		case "cover": return t.left >= e.left && t.top >= e.top && t.right <= e.right && t.bottom <= e.bottom;
		case "touch": return e.right >= t.left && e.left <= t.right && e.bottom >= t.top && e.top <= t.bottom;
	}
}, $t = () => matchMedia("(hover: none), (pointer: coarse)").matches, en = () => "safari" in window, W = (e) => Array.isArray(e) ? e : [e], tn = (e) => (t, n, r, i = {}) => {
	(t instanceof HTMLCollection || t instanceof NodeList) && (t = Array.from(t)), n = W(n), t = W(t);
	for (let a of t) if (a) for (let t of n) a[e](t, r, {
		capture: !1,
		...i
	});
}, G = tn("addEventListener"), K = tn("removeEventListener"), q = (e) => {
	let { clientX: t, clientY: n, target: r } = e.touches?.[0] ?? e;
	return {
		x: t,
		y: n,
		target: r
	};
}, J = (e, t = document) => W(e).map((e) => typeof e == "string" ? Array.from(t.querySelectorAll(e)) : e instanceof Element ? e : null).flat().filter(Boolean), nn = (e, t) => t.some((t) => typeof t == "number" ? e.button === t : typeof t == "object" && t.button === e.button && t.modifiers.every((t) => {
	switch (t) {
		case "alt": return e.altKey;
		case "ctrl": return e.ctrlKey || e.metaKey;
		case "shift": return e.shiftKey;
	}
})), { abs: Y, max: rn, min: an, ceil: on } = Math, sn = (e = []) => ({
	stored: e,
	selected: [],
	touched: [],
	changed: {
		added: [],
		removed: []
	}
}), cn = class extends Jt {
	static version = "mind-elixir-fork";
	_options;
	_selection = sn();
	_area;
	_clippingElement;
	_targetElement;
	_targetBoundary;
	_targetBoundaryScrolled = !0;
	_targetRect;
	_selectables = [];
	_latestElement;
	_areaLocation = {
		y1: 0,
		x2: 0,
		y2: 0,
		x1: 0
	};
	_areaRect = Xt();
	_singleClick = !0;
	_frame;
	_scrollAvailable = !0;
	_scrollingActive = !1;
	_scrollSpeed = {
		x: 0,
		y: 0
	};
	_scrollDelta = {
		x: 0,
		y: 0
	};
	constructor(e) {
		super(), this._options = {
			selectionAreaClass: "selection-area",
			selectionContainerClass: void 0,
			selectables: [],
			document: window.document,
			startAreas: ["html"],
			boundaries: ["html"],
			container: "body",
			mindElixirInstance: void 0,
			...e,
			behaviour: {
				overlap: "invert",
				intersect: "touch",
				triggers: [0],
				...e.behaviour,
				startThreshold: e.behaviour?.startThreshold ? typeof e.behaviour.startThreshold == "number" ? e.behaviour.startThreshold : {
					x: 10,
					y: 10,
					...e.behaviour.startThreshold
				} : {
					x: 10,
					y: 10
				},
				scrolling: {
					speedDivider: 10,
					...e.behaviour?.scrolling,
					startScrollMargins: {
						x: 0,
						y: 0,
						...e.behaviour?.scrolling?.startScrollMargins
					}
				}
			},
			features: {
				range: !0,
				touch: !0,
				deselectOnBlur: !1,
				...e.features,
				singleTap: {
					allow: !0,
					intersect: "native",
					...e.features?.singleTap
				}
			}
		};
		for (let e of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) typeof this[e] == "function" && (this[e] = this[e].bind(this));
		let { document: t, selectionAreaClass: n, selectionContainerClass: r } = this._options;
		this._area = t.createElement("div"), this._clippingElement = t.createElement("div"), this._clippingElement.appendChild(this._area), this._area.classList.add(n), r && this._clippingElement.classList.add(r), U(this._area, {
			willChange: "top, left, bottom, right, width, height",
			top: 0,
			left: 0,
			position: "fixed"
		}), U(this._clippingElement, {
			overflow: "hidden",
			position: "fixed",
			transform: "translate3d(0, 0, 0)",
			pointerEvents: "none",
			zIndex: "1"
		}), this._frame = Zt((e) => {
			this._recalculateSelectionAreaRect(), this._updateElementSelection(), this._emitEvent("move", e), this._redrawSelectionArea();
		}), this.enable();
	}
	_toggleStartEvents(e = !0) {
		let { document: t } = this._options;
		(e ? G : K)(t, "pointerdown", this._onTapStart);
	}
	_onTapStart(e, t = !1) {
		let { x: n, y: r, target: i } = q(e), { document: a, startAreas: o, boundaries: s, behaviour: c, features: l } = this._options, u = i.getBoundingClientRect();
		if (!nn(e, c.triggers)) return;
		let d = J(o, a), f = J(s, a);
		this._targetElement = f.find((e) => Qt(e.getBoundingClientRect(), u));
		let p = e.composedPath(), m = d.find((e) => p.includes(e));
		if (this._targetBoundary = f.find((e) => p.includes(e)), !this._targetElement || !m || !this._targetBoundary || !t && this._emitEvent("beforestart", e) === !1) return;
		this._areaLocation = {
			x1: n,
			y1: r,
			x2: 0,
			y2: 0
		};
		let h = a.scrollingElement ?? a.body;
		this._scrollDelta = {
			x: h.scrollLeft,
			y: h.scrollTop
		}, this._singleClick = !0, this.clearSelection(!1, !0), G(a, ["pointermove"], this._delayedTapMove, { passive: !1 }), G(a, ["pointerup", "pointercancel"], this._onTapStop), G(a, "scroll", this._onScroll), l.deselectOnBlur && (this._targetBoundaryScrolled = !1, G(this._targetBoundary, "scroll", this._onStartAreaScroll));
	}
	_onSingleTap(e) {
		let { singleTap: { intersect: t }, range: n } = this._options.features, r = q(e), i;
		if (t === "native") i = r.target;
		else if (t === "touch") {
			this.resolveSelectables();
			let { x: e, y: t } = r;
			i = this._selectables.find((n) => {
				let { right: r, left: i, top: a, bottom: o } = n.getBoundingClientRect();
				return e < r && e > i && t < o && t > a;
			});
		}
		if (!i) return;
		for (this.resolveSelectables(); !this._selectables.includes(i);) if (i.parentElement) i = i.parentElement;
		else {
			this._targetBoundaryScrolled || this.clearSelection();
			return;
		}
		let { stored: a } = this._selection;
		if (this._emitEvent("start", e), e.shiftKey && n && this._latestElement) {
			let e = this._latestElement, [t, n] = e.compareDocumentPosition(i) & 4 ? [i, e] : [e, i], r = [
				...this._selectables.filter((e) => e.compareDocumentPosition(t) & 4 && e.compareDocumentPosition(n) & 2),
				t,
				n
			];
			this.select(r), this._latestElement = e;
		} else a.includes(i) && (a.length === 1 || e.ctrlKey || a.every((e) => this._selection.stored.includes(e))) ? this.deselect(i) : (this.select(i), this._latestElement = i);
	}
	_delayedTapMove(e) {
		let { container: t, document: n, behaviour: { startThreshold: r } } = this._options, { x1: i, y1: a } = this._areaLocation, { x: o, y: s } = q(e);
		if (typeof r == "number" && Y(o + s - (i + a)) >= r || typeof r == "object" && Y(o - i) >= r.x || Y(s - a) >= r.y) {
			if (K(n, ["pointermove"], this._delayedTapMove, { passive: !1 }), this._emitEvent("beforedrag", e) === !1) {
				K(n, ["pointerup", "pointercancel"], this._onTapStop);
				return;
			}
			G(n, ["pointermove"], this._onTapMove, { passive: !1 }), U(this._area, "display", "block"), J(t, n)[0].appendChild(this._clippingElement), this.resolveSelectables(), this._singleClick = !1, this._targetRect = this._targetElement.getBoundingClientRect(), this._scrollAvailable = this._targetElement.scrollHeight !== this._targetElement.clientHeight || this._targetElement.scrollWidth !== this._targetElement.clientWidth, this._scrollAvailable && (this._selectables = this._selectables.filter((e) => this._targetElement.contains(e))), this._setupSelectionArea(), this._emitEvent("start", e), this._onTapMove(e);
		}
		this._handleMoveEvent(e);
	}
	_setupSelectionArea() {
		let { _clippingElement: e, _targetElement: t, _area: n } = this, r = this._targetRect = t.getBoundingClientRect();
		this._scrollAvailable ? (U(e, {
			top: r.top,
			left: r.left,
			width: r.width,
			height: r.height
		}), U(n, {
			marginTop: -r.top,
			marginLeft: -r.left
		})) : (U(e, {
			top: 0,
			left: 0,
			width: "100%",
			height: "100%"
		}), U(n, {
			marginTop: 0,
			marginLeft: 0
		}));
	}
	_onTapMove(e) {
		let { _scrollSpeed: t, _areaLocation: n, _options: r, _frame: i } = this, { speedDivider: a } = r.behaviour.scrolling, { x: o, y: s } = q(e);
		if (n.x2 = o, n.y2 = s, this._scrollAvailable && !this._scrollingActive && (t.y || t.x)) {
			this._scrollingActive = !0;
			let r = () => {
				if (!t.x && !t.y) {
					this._scrollingActive = !1;
					return;
				}
				let o = this._options.mindElixirInstance;
				if (o && o.move) {
					let e = t.x ? on(t.x / a) : 0, r = t.y ? on(t.y / a) : 0;
					(e || r) && (o.move(-e, -r), n.x1 -= e, n.y1 -= r);
				}
				i.next(e), requestAnimationFrame(r);
			};
			requestAnimationFrame(r);
		} else i.next(e);
		this._handleMoveEvent(e);
	}
	_handleMoveEvent(e) {
		let { features: t } = this._options;
		(t.touch && $t() || this._scrollAvailable && en()) && e.preventDefault();
	}
	_onScroll() {
		let { _scrollDelta: e, _options: { document: t } } = this, { scrollTop: n, scrollLeft: r } = t.scrollingElement ?? t.body;
		this._areaLocation.x1 += e.x - r, this._areaLocation.y1 += e.y - n, e.x = r, e.y = n, this._setupSelectionArea(), this._frame.next(null);
	}
	_onStartAreaScroll() {
		this._targetBoundaryScrolled = !0, K(this._targetElement, "scroll", this._onStartAreaScroll);
	}
	_recalculateSelectionAreaRect() {
		let { _scrollSpeed: e, _areaLocation: t, _targetElement: n, _options: r } = this, i = this._targetRect, { x1: a, y1: o } = t, { x2: s, y2: c } = t, { behaviour: { scrolling: { startScrollMargins: l } } } = r;
		s < i.left + l.x ? (e.x = -Y(i.left - s + l.x), s = s < i.left ? i.left : s) : s > i.right - l.x ? (e.x = Y(i.left + i.width - s - l.x), s = s > i.right ? i.right : s) : e.x = 0, c < i.top + l.y ? (e.y = -Y(i.top - c + l.y), c = c < i.top ? i.top : c) : c > i.bottom - l.y ? (e.y = Y(i.top + i.height - c - l.y), c = c > i.bottom ? i.bottom : c) : e.y = 0;
		let u = an(a, s), d = an(o, c), f = rn(a, s), p = rn(o, c);
		this._areaRect = Xt(u, d, f - u, p - d);
	}
	_redrawSelectionArea() {
		let { x: e, y: t, width: n, height: r } = this._areaRect, { style: i } = this._area;
		i.left = `${e}px`, i.top = `${t}px`, i.width = `${n}px`, i.height = `${r}px`;
	}
	_onTapStop(e, t) {
		let { document: n, features: r } = this._options, { _singleClick: i } = this;
		K(this._targetElement, "scroll", this._onStartAreaScroll), K(n, ["pointermove"], this._delayedTapMove), K(n, ["pointermove"], this._onTapMove), K(n, ["pointerup", "pointercancel"], this._onTapStop), K(n, "scroll", this._onScroll), this._keepSelection(), e && i && r.singleTap.allow ? this._onSingleTap(e) : !i && !t && (this._updateElementSelection(), this._emitEvent("stop", e)), this._scrollSpeed.x = 0, this._scrollSpeed.y = 0, this._clippingElement.remove(), this._frame?.cancel(), U(this._area, "display", "none");
	}
	_updateElementSelection() {
		let { _selectables: e, _options: t, _selection: n, _areaRect: r } = this, { stored: i, selected: a, touched: o } = n, { intersect: s, overlap: c } = t.behaviour, l = c === "invert", u = [], d = [], f = [];
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			if (Qt(r, n.getBoundingClientRect(), s)) {
				if (a.includes(n)) i.includes(n) && !o.includes(n) && o.push(n);
				else if (l && i.includes(n)) {
					f.push(n);
					continue;
				} else d.push(n);
				u.push(n);
			}
		}
		l && d.push(...i.filter((e) => !a.includes(e)));
		let p = c === "keep";
		for (let e = 0; e < a.length; e++) {
			let t = a[e];
			!u.includes(t) && !(p && i.includes(t)) && f.push(t);
		}
		n.selected = u, n.changed = {
			added: d,
			removed: f
		}, this._latestElement = void 0;
	}
	_emitEvent(e, t) {
		return this.emit(e, {
			event: t,
			store: this._selection,
			selection: this
		});
	}
	_keepSelection() {
		let { _options: e, _selection: t } = this, { selected: n, changed: r, touched: i, stored: a } = t, o = n.filter((e) => !a.includes(e));
		switch (e.behaviour.overlap) {
			case "drop":
				t.stored = [...o, ...a.filter((e) => !i.includes(e))];
				break;
			case "invert":
				t.stored = [...o, ...a.filter((e) => !r.removed.includes(e))];
				break;
			case "keep": t.stored = [...a, ...n.filter((e) => !a.includes(e))];
		}
	}
	trigger(e, t = !0) {
		this._onTapStart(e, t);
	}
	resolveSelectables() {
		this._selectables = J(this._options.selectables, this._options.document);
	}
	clearSelection(e = !0, t = !1) {
		let { selected: n, stored: r, changed: i } = this._selection;
		i.added = [], i.removed.push(...n, ...e ? r : []), t || (this._emitEvent("move", null), this._emitEvent("stop", null)), this._selection = sn(e ? [] : r);
	}
	getSelection() {
		return this._selection.stored;
	}
	getSelectionArea() {
		return this._area;
	}
	getSelectables() {
		return this._selectables;
	}
	setAreaLocation(e) {
		Object.assign(this._areaLocation, e), this._redrawSelectionArea();
	}
	getAreaLocation() {
		return this._areaLocation;
	}
	cancel(e = !1) {
		this._onTapStop(null, !e);
	}
	destroy() {
		this.cancel(), this.disable(), this._clippingElement.remove(), super.unbindAllListeners();
	}
	enable = this._toggleStartEvents;
	disable = this._toggleStartEvents.bind(this, !1);
	select(e, t = !1) {
		let { changed: n, selected: r, stored: i } = this._selection, a = J(e, this._options.document).filter((e) => !r.includes(e) && !i.includes(e));
		return i.push(...a), r.push(...a), n.added.push(...a), n.removed = [], this._latestElement = void 0, t || (this._emitEvent("move", null), this._emitEvent("stop", null)), a;
	}
	deselect(e, t = !1) {
		let { selected: n, stored: r, changed: i } = this._selection, a = J(e, this._options.document).filter((e) => n.includes(e) || r.includes(e));
		this._selection.stored = r.filter((e) => !a.includes(e)), this._selection.selected = n.filter((e) => !a.includes(e)), this._selection.changed.added = [], this._selection.changed.removed.push(...a.filter((e) => !i.removed.includes(e))), this._latestElement = void 0, t || (this._emitEvent("move", null), this._emitEvent("stop", null));
	}
};
//#endregion
//#region src/plugin/selection.ts
function ln(e) {
	let t = e.mouseSelectionButton === 2 ? [2] : [0], n = new cn({
		selectables: [".map-container .me-tpc"],
		boundaries: [e.container],
		container: e.selectionContainer,
		mindElixirInstance: e,
		features: {
			touch: !1,
			singleTap: { allow: !1 }
		},
		behaviour: {
			triggers: t,
			scrolling: {
				speedDivider: 10,
				startScrollMargins: {
					x: 50,
					y: 50
				}
			}
		}
	}).on("beforestart", ({ event: t }) => {
		if (!e.editable || e.spacePressed || e.ptState !== 5) return !1;
		let r = t.target;
		if (r.id === "input-box" || r.className === "circle" || r.className !== "map-container") return !1;
		!t.ctrlKey && !t.metaKey && e.clearSelection();
		let i = n.getSelectionArea();
		return i.style.background = "#4f90f22d", i.style.border = "1px solid #4f90f2", i.style.borderRadius = "3px", i.parentElement && (i.parentElement.style.zIndex = "9999"), !0;
	}).on("move", ({ store: { changed: { added: t, removed: n } } }) => {
		if (t.length > 0 || n.length, t.length > 0) {
			let n = t.filter((t) => !e.currentNodes?.includes(t));
			if (n.length > 0) {
				for (let e of n) e.classList.add("selected");
				e.currentNodes = [...e.currentNodes || [], ...n], e.bus.fire("selectNodes", n.map((e) => e.nodeObj));
			}
		}
		if (n.length > 0) {
			let t = n.filter((t) => e.currentNodes?.includes(t));
			if (t.length > 0) {
				for (let e of t) e.classList.remove("selected");
				e.currentNodes = (e.currentNodes || []).filter((e) => !t.includes(e)), e.bus.fire("unselectNodes", t.map((e) => e.nodeObj));
			}
		}
	});
	e.selection = n;
}
//#endregion
//#region src/utils/generateBranch.ts
var un = function(e, t, n, r, i = 8) {
	if (e === n) return `M ${e} ${t} V ${r}`;
	let a = (t + r) / 2, o = n > e ? 1 : -1, s = Math.min(i, Math.abs(n - e) / 2, Math.abs(a - t), Math.abs(r - a));
	return `M ${e} ${t} V ${a - s} Q ${e} ${a} ${e + o * s} ${a} H ${n - o * s} Q ${n} ${a} ${n} ${a + s} V ${r}`;
};
function dn({ pT: e, pL: t, pW: n, pH: r, cT: i, cL: a, cW: o, cH: s, direction: c, containerHeight: l, containerWidth: u }) {
	if (c === A.DOWN) {
		let s = t + n / 2, c = a + o / 2;
		return un(s, e + r, c, i);
	}
	let d = t + n / 2, f = e + r / 2, p;
	p = c === A.LHS ? a + o : a;
	let m = i + s / 2, h = (1 - Math.abs(m - f) / l) * .25 * (n / 2);
	return d = c === A.LHS ? d - n / 10 - h : d + n / 10 + h, `M ${d} ${f} Q ${d} ${m} ${p} ${m}`;
}
function fn({ pT: e, pL: t, pW: n, pH: r, cT: i, cL: a, cW: o, cH: s, direction: c, isFirst: l }) {
	if (c === A.DOWN) return un(t + n / 2, e + r, a + o / 2, i);
	let u = parseInt(this.container.style.getPropertyValue("--node-gap-x")), d = 0, f = 0;
	d = l ? e + r / 2 : e + r;
	let p = i + s, m = 0, h = 0, g = 0, _ = Math.abs(d - p) / 300 * u;
	return c === A.LHS ? (g = t, m = g + u, h = g - u, f = a + u, `M ${m} ${d} C ${g} ${d} ${g + _} ${p} ${h} ${p} H ${f}`) : (g = t + n, m = g - u, h = g + u, f = a + o - u, `M ${m} ${d} C ${g} ${d} ${g - _} ${p} ${h} ${p} H ${f}`);
}
//#endregion
//#region src/utils/theme.ts
var pn = function(e, t = !0) {
	this.theme = e, this.generateMainBranch = this.theme.generateMainBranch || dn, this.generateSubBranch = this.theme.generateSubBranch || fn;
	let n = {
		...(this.theme.type === "dark" ? s : o).cssVar,
		...this.theme.cssVar
	};
	this.compact && (n["--node-gap-x"] = "15px", n["--node-gap-y"] = "2px", n["--main-gap-x"] = "30px", n["--main-gap-y"] = "6px");
	let r = Object.keys(n);
	for (let e = 0; e < r.length; e++) {
		let t = r[e];
		this.container.style.setProperty(t, n[t]);
	}
	t && this.refresh();
}, mn = function(e) {
	this.compact = e, this.theme && this.changeTheme(this.theme);
}, hn = { create: function(e) {
	return {
		dom: e,
		moved: !1,
		sessionMoved: !1,
		pointerdown: !1,
		lastX: 0,
		lastY: 0,
		handlePointerMove(e) {
			if (this.pointerdown) {
				this.moved = !0, this.sessionMoved = !0;
				let t = e.clientX - this.lastX, n = e.clientY - this.lastY;
				this.lastX = e.clientX, this.lastY = e.clientY, this.cb && this.cb(t, n);
			}
		},
		handlePointerDown(e) {
			e.button === 0 && (this.pointerdown = !0, this.sessionMoved = !1, this.lastX = e.clientX, this.lastY = e.clientY, this.dom.setPointerCapture(e.pointerId));
		},
		handleClear(e) {
			let t = this.pointerdown && this.sessionMoved;
			this.pointerdown = !1, this.sessionMoved = !1, e.pointerId !== void 0 && this.dom.releasePointerCapture(e.pointerId), t && this.onEnd && this.onEnd();
		},
		cb: null,
		onEnd: null,
		init(e, t, n) {
			this.cb = t, this.onEnd = n || null, this.handleClear = this.handleClear.bind(this), this.handlePointerMove = this.handlePointerMove.bind(this), this.handlePointerDown = this.handlePointerDown.bind(this), this.destroy = S([
				{
					dom: e,
					evt: "pointermove",
					func: this.handlePointerMove
				},
				{
					dom: e,
					evt: "pointerleave",
					func: this.handleClear
				},
				{
					dom: e,
					evt: "pointerup",
					func: this.handleClear
				},
				{
					dom: this.dom,
					evt: "pointerdown",
					func: this.handlePointerDown
				}
			]);
		},
		destroy: null,
		clear() {
			this.moved = !1, this.pointerdown = !1;
		}
	};
} }, gn = /* @__PURE__ */ t({
	createArrow: () => Cn,
	createArrowFrom: () => wn,
	editArrowLabel: () => Pn,
	removeArrow: () => Tn,
	renderArrow: () => Nn,
	reshapeArrow: () => In,
	selectArrow: () => En,
	tidyArrow: () => Fn,
	unselectArrow: () => Dn
}), _n = "#4dc4ff";
function vn(e, t, n, r, i, a, o, s) {
	return {
		x: e / 8 + n * 3 / 8 + i * 3 / 8 + o / 8,
		y: t / 8 + r * 3 / 8 + a * 3 / 8 + s / 8
	};
}
function yn(e, t, n) {
	e && (e.dataset.x = t.toString(), e.dataset.y = n.toString(), z(e));
}
function X(e, t, n, r, i) {
	v(e, {
		x1: t + "",
		y1: n + "",
		x2: r + "",
		y2: i + ""
	});
}
function bn(e, t, n, r, i, a, o, s, c, l) {
	let u = `M ${t} ${n} C ${r} ${i} ${a} ${o} ${s} ${c}`;
	e.line.setAttribute("d", u);
	let d = l.style || {};
	e.line.setAttribute("stroke", d.stroke || "rgb(227, 125, 116)"), e.line.setAttribute("stroke-width", String(d.strokeWidth || "2")), e.line.setAttribute("stroke-dasharray", d.strokeDasharray || "8,2"), d.opacity !== void 0 && d.opacity !== null && d.opacity !== "" ? e.line.setAttribute("opacity", String(d.opacity)) : e.line.removeAttribute("opacity");
	let f = e.querySelectorAll("path[stroke=\"transparent\"]");
	f.length > 0 && f[0].setAttribute("d", u);
	let m = p(a, o, s, c);
	if (m) {
		let t = `M ${m.x1} ${m.y1} L ${s} ${c} L ${m.x2} ${m.y2}`;
		e.arrow1.setAttribute("d", t), f.length > 1 && f[1].setAttribute("d", t), e.arrow1.setAttribute("stroke", d.stroke || "rgb(227, 125, 116)"), e.arrow1.setAttribute("stroke-width", String(d.strokeWidth || "2")), d.opacity !== void 0 && d.opacity !== null && d.opacity !== "" ? e.arrow1.setAttribute("opacity", String(d.opacity)) : e.arrow1.removeAttribute("opacity");
	}
	if (l.bidirectional) {
		let a = p(r, i, t, n);
		if (a) {
			let r = `M ${a.x1} ${a.y1} L ${t} ${n} L ${a.x2} ${a.y2}`;
			e.arrow2.setAttribute("d", r), f.length > 2 && f[2].setAttribute("d", r);
		}
	} else e.arrow2.setAttribute("d", ""), f.length > 2 && f[2].setAttribute("d", "");
	e.arrow2.setAttribute("stroke", d.stroke || "rgb(227, 125, 116)"), e.arrow2.setAttribute("stroke-width", String(d.strokeWidth || "2")), d.opacity !== void 0 && d.opacity !== null && d.opacity !== "" ? e.arrow2.setAttribute("opacity", String(d.opacity)) : e.arrow2.removeAttribute("opacity");
	let { x: h, y: g } = vn(t, n, r, i, a, o, s, c);
	e.labelEl && yn(e.labelEl, h, g);
	let _ = e.labelEl;
	_ && (_.style.color = d.labelColor || "rgb(235, 95, 82)"), jn(e);
}
function Z(e, t, n) {
	let { offsetLeft: r, offsetTop: i } = _(e.nodes, t), a = t.offsetWidth, o = t.offsetHeight, s = r + a / 2, c = i + o / 2;
	return {
		w: a,
		h: o,
		cx: s,
		cy: c,
		ctrlX: s + n.x,
		ctrlY: c + n.y
	};
}
function Q(e) {
	let t = e.w / 2, n = e.h / 2, r = e.ctrlX - e.cx, i = e.ctrlY - e.cy, a = Math.hypot(r, i);
	if (a === 0 || t === 0 && n === 0) return {
		x: e.cx,
		y: e.cy
	};
	let o = r / a, s = i / a, c = Math.min(t / Math.abs(o), n / Math.abs(s));
	return {
		x: e.cx + o * c,
		y: e.cy + s * c
	};
}
var xn = function(e, t, n) {
	let r = _(e.nodes, t), i = _(e.nodes, n), a = r.offsetLeft + t.offsetWidth / 2, o = r.offsetTop + t.offsetHeight / 2, s = i.offsetLeft + n.offsetWidth / 2, c = i.offsetTop + n.offsetHeight / 2, l = s - a, u = c - o, d = Math.sqrt(l * l + u * u), f = Math.max(50, Math.min(200, d * .3)), p = Math.abs(l), m = Math.abs(u), h, g;
	if (d < 150) {
		let e = t.closest(".me-main"), n = e ? e.classList.contains("lhs") ? -1 : 1 : l > 0 ? -1 : 1;
		h = {
			x: 200 * n,
			y: 0
		}, g = {
			x: 200 * n,
			y: 0
		};
	} else if (p > m * 1.5) {
		let e = l > 0 ? t.offsetWidth / 2 : -t.offsetWidth / 2, r = l > 0 ? -n.offsetWidth / 2 : n.offsetWidth / 2;
		h = {
			x: e + (l > 0 ? f : -f),
			y: 0
		}, g = {
			x: r + (l > 0 ? -f : f),
			y: 0
		};
	} else if (m > p * 1.5) {
		let e = u > 0 ? t.offsetHeight / 2 : -t.offsetHeight / 2, r = u > 0 ? -n.offsetHeight / 2 : n.offsetHeight / 2;
		h = {
			x: 0,
			y: e + (u > 0 ? f : -f)
		}, g = {
			x: 0,
			y: r + (u > 0 ? -f : f)
		};
	} else {
		let e = Math.atan2(u, l), r = t.offsetWidth / 2 * Math.cos(e), i = t.offsetHeight / 2 * Math.sin(e), a = -(n.offsetWidth / 2) * Math.cos(e), o = -(n.offsetHeight / 2) * Math.sin(e), s = f * .7 * (l > 0 ? 1 : -1), c = f * .7 * (u > 0 ? 1 : -1);
		h = {
			x: r + s,
			y: i + c
		}, g = {
			x: a - s,
			y: o - c
		};
	}
	return {
		delta1: {
			x: Math.round(h.x),
			y: Math.round(h.y)
		},
		delta2: {
			x: Math.round(g.x),
			y: Math.round(g.y)
		}
	};
}, Sn = function(e, t, n, r, i) {
	if (!t || !n) return;
	if (!r.delta1 || !r.delta2) {
		let i = xn(e, t, n);
		r.delta1 = i.delta1, r.delta2 = i.delta2;
	}
	let a = Z(e, t, r.delta1), o = Z(e, n, r.delta2), { x: s, y: c } = Q(a), { ctrlX: l, ctrlY: u } = a, { ctrlX: d, ctrlY: f } = o, { x: m, y: h } = Q(o), g = p(d, f, m, h);
	if (!g) return;
	let _ = `M ${g.x1} ${g.y1} L ${m} ${h} L ${g.x2} ${g.y2}`, v = "";
	if (r.bidirectional) {
		let e = p(l, u, s, c);
		if (!e) return;
		v = `M ${e.x1} ${e.y1} L ${s} ${c} L ${e.x2} ${e.y2}`;
	}
	let y = It(`M ${s} ${c} C ${l} ${u} ${d} ${f} ${m} ${h}`, _, v, r.style), { x: b, y: x } = vn(s, c, l, u, d, f, m, h), S = r.style?.labelColor || "rgb(235, 95, 82)", C = "a-" + r.id;
	y.id = C;
	let w = B(e.markdown ? e.markdown(r.label, r) : r.label, b, x, {
		anchor: "middle",
		color: S,
		dataType: "arrow",
		svgId: C
	});
	y.labelEl = w, y.arrowObj = r, y.dataset.linkid = r.id, e.labelContainer.appendChild(w), e.arrowSvg.appendChild(y), z(w), i || (e.arrows.push(r), e.currentArrow = y, Mn(e, r, a, o));
}, Cn = function(e, t, n = {}) {
	let r = {
		id: m(),
		label: "Custom Link",
		from: e.nodeObj.id,
		to: t.nodeObj.id,
		...n
	};
	Sn(this, e, t, r), this.bus.fire("operation", {
		name: "createArrow",
		target: r
	});
}, wn = function(e) {
	$(this);
	let t = {
		...e,
		id: m()
	};
	Sn(this, this.findEle(t.from), this.findEle(t.to), t), this.bus.fire("operation", {
		name: "createArrow",
		target: t
	});
}, Tn = function(e) {
	let t;
	if (t = e || this.currentArrow, !t) return;
	$(this);
	let n = g(t.arrowObj);
	this.arrows = this.arrows.filter((e) => e.id !== n.id), t.labelEl?.remove(), t.remove(), this.bus.fire("operation", {
		name: "removeArrow",
		target: n
	});
}, En = function(e) {
	this.currentArrow = e;
	let t = e.arrowObj, n = this.findEle(t.from), r = this.findEle(t.to), i = Z(this, n, t.delta1), a = Z(this, r, t.delta2);
	this.editable ? Mn(this, t, i, a) : kn(e, _n), this.bus.fire("selectArrow", t);
}, Dn = function() {
	$(this), this.currentArrow = null, this.bus.fire("unselectArrow");
}, On = function(e, t) {
	let n = document.createElementNS(R, "path");
	return v(n, {
		d: e,
		stroke: t,
		fill: "none",
		"stroke-width": "6",
		"stroke-linecap": "round",
		"stroke-linejoin": "round"
	}), n;
}, kn = function(e, t) {
	let n = document.createElementNS(R, "g");
	n.setAttribute("class", "arrow-highlight"), n.setAttribute("opacity", "0.45");
	let r = On(e.line.getAttribute("d"), t);
	n.appendChild(r);
	let i = On(e.arrow1.getAttribute("d"), t);
	if (n.appendChild(i), e.arrow2.getAttribute("d")) {
		let r = On(e.arrow2.getAttribute("d"), t);
		n.appendChild(r);
	}
	e.insertBefore(n, e.firstChild);
}, An = function(e) {
	let t = e.querySelector(".arrow-highlight");
	t && t.remove();
}, jn = function(e) {
	let t = e.querySelector(".arrow-highlight");
	if (!t) return;
	let n = t.querySelectorAll("path");
	n.length >= 1 && n[0].setAttribute("d", e.line.getAttribute("d")), n.length >= 2 && n[1].setAttribute("d", e.arrow1.getAttribute("d")), n.length >= 3 && e.arrow2.getAttribute("d") && n[2].setAttribute("d", e.arrow2.getAttribute("d"));
}, $ = function(e) {
	e.helper1?.destroy(), e.helper2?.destroy(), e.linkController.style.display = "none", e.P2.style.display = "none", e.P3.style.display = "none", e.currentArrow && An(e.currentArrow);
}, Mn = function(e, t, n, r) {
	let { linkController: i, P2: a, P3: o, line1: s, line2: c, nodes: l, map: u, currentArrow: d, bus: f } = e;
	if (!d) return;
	i.style.display = "initial", a.style.display = "initial", o.style.display = "initial", l.appendChild(i), l.appendChild(a), l.appendChild(o), kn(d, _n);
	let { x: p, y: m } = Q(n), { ctrlX: h, ctrlY: _ } = n, { ctrlX: v, ctrlY: y } = r, { x: b, y: x } = Q(r);
	a.style.cssText = `top:${_}px;left:${h}px;`, o.style.cssText = `top:${y}px;left:${v}px;`, X(s, p, m, h, _), X(c, v, y, b, x), e.helper1 = hn.create(a), e.helper2 = hn.create(o);
	let S = g(t), C = () => {
		f.fire("operation", {
			name: "reshapeArrow",
			target: t,
			origin: S
		}), S = g(t);
	};
	e.helper1.init(u, (r, i) => {
		h += r / e.scaleVal, _ += i / e.scaleVal;
		let o = Q({
			...n,
			ctrlX: h,
			ctrlY: _
		});
		p = o.x, m = o.y, a.style.top = _ + "px", a.style.left = h + "px", bn(d, p, m, h, _, v, y, b, x, t), X(s, p, m, h, _), t.delta1.x = Math.round(h - n.cx), t.delta1.y = Math.round(_ - n.cy), f.fire("updateArrowDelta", t);
	}, C), e.helper2.init(u, (n, i) => {
		v += n / e.scaleVal, y += i / e.scaleVal;
		let a = Q({
			...r,
			ctrlX: v,
			ctrlY: y
		});
		b = a.x, x = a.y, o.style.top = y + "px", o.style.left = v + "px", bn(d, p, m, h, _, v, y, b, x, t), X(c, v, y, b, x), t.delta2.x = Math.round(v - r.cx), t.delta2.y = Math.round(y - r.cy), f.fire("updateArrowDelta", t);
	}, C);
};
function Nn() {
	this.arrowSvg.innerHTML = "", this.labelContainer.querySelectorAll(".svg-label[data-type=\"arrow\"]").forEach((e) => e.remove());
	for (let e = 0; e < this.arrows.length; e++) {
		let t = this.arrows[e];
		try {
			Sn(this, this.findEle(t.from), this.findEle(t.to), t, !0);
		} catch {
			console.warn("Node may not be expanded");
		}
	}
	this.nodes.appendChild(this.arrowSvg);
}
function Pn(e) {
	$(this), e && e.labelEl && Lt(this, e.labelEl, e.arrowObj);
}
function Fn() {
	this.arrows = this.arrows.filter((e) => l(e.from, this.nodeData) && l(e.to, this.nodeData));
}
var In = function(e, t) {
	let n = g(e);
	n.style && t.style && (t.style = Object.assign({}, n.style, t.style)), Object.assign(e, t);
	let r = this.arrowSvg.querySelector(`g[data-linkid="${e.id}"]`);
	if (r) {
		if (t.label !== void 0 && r.labelEl) {
			let t = this.markdown ? this.markdown(e.label, e) : e.label;
			r.labelEl.innerHTML = t;
		}
		let n = this.findEle(e.from), i = this.findEle(e.to);
		if (n && i) {
			if (!e.delta1 || !e.delta2) {
				let t = xn(this, n, i);
				e.delta1 = e.delta1 || t.delta1, e.delta2 = e.delta2 || t.delta2;
			}
			let t = Z(this, n, e.delta1), a = Z(this, i, e.delta2), { x: o, y: s } = Q(t), { ctrlX: c, ctrlY: l } = t, { ctrlX: u, ctrlY: d } = a, { x: f, y: p } = Q(a);
			bn(r, o, s, c, l, u, d, f, p, e), this.currentArrow?.arrowObj?.id === e.id && (this.P2.style.cssText = `top:${l}px;left:${c}px;`, this.P3.style.cssText = `top:${d}px;left:${u}px;`, X(this.line1, o, s, c, l), X(this.line2, u, d, f, p));
		}
	}
	this.bus.fire("operation", {
		name: "reshapeArrow",
		target: e,
		origin: n
	});
}, Ln = /* @__PURE__ */ t({
	createSummary: () => Gn,
	createSummaryFrom: () => Kn,
	editSummary: () => Zn,
	removeSummary: () => qn,
	renderSummary: () => Xn,
	selectSummary: () => Jn,
	unselectSummary: () => Yn
}), Rn = function(e) {
	if (e.length === 0) throw Error("No selected node.");
	if (e.length === 1) {
		let t = e[0].nodeObj, n = e[0].nodeObj.parent;
		if (!n) throw Error("Can not select root node.");
		let r = n.children.findIndex((e) => t === e);
		return {
			parent: n.id,
			start: r,
			end: r
		};
	}
	let t = 0, n = e.map((e) => {
		let n = e.nodeObj, r = [];
		for (; n.parent;) {
			let e = n.parent, t = e.children?.indexOf(n);
			n = e, r.unshift({
				node: n,
				index: t
			});
		}
		return r.length > t && (t = r.length), r;
	}), r = 0;
	findMcp: for (; r < t; r++) {
		let e = n[0][r]?.node;
		for (let t = 1; t < n.length; t++) if (n[t][r]?.node !== e) break findMcp;
	}
	if (!r) throw Error("Can not select root node.");
	let i = n.map((e) => e[r - 1].index).sort((e, t) => e - t), a = i[0] || 0, o = i[i.length - 1] || 0, s = n[0][r - 1].node;
	if (!s.parent) throw Error("Please select nodes in the same main topic.");
	return {
		parent: s.id,
		start: a,
		end: o
	};
}, zn = function(e) {
	let t = document.createElementNS(R, "g");
	return t.setAttribute("id", e), t;
}, Bn = function(e, t) {
	let n = document.createElementNS(R, "path");
	return v(n, {
		d: e,
		stroke: t || "#666",
		fill: "none",
		"stroke-linecap": "round",
		"stroke-width": "2"
	}), n;
}, Vn = (e) => e.parentElement.parentElement, Hn = function(e, t) {
	let n = e.summaries.findIndex((e) => e.id === t);
	return n !== -1 && (e.summaries.splice(n, 1), e.nodes.querySelector("#s-" + t)?.remove(), e.nodes.querySelector("#label-s-" + t)?.remove(), !0);
}, Un = function(e, { parent: t, start: n }) {
	let r = e.findEle(t), i = r.nodeObj, a;
	return a = i.parent ? M(r.closest(".me-main")) : M(e.findEle(i.children[n].id).closest(".me-main")), a;
}, Wn = function(e, t) {
	let { id: n, label: r, parent: i, start: a, end: o, style: s } = t, { nodes: c, theme: l, summarySvg: u } = e, d = e.findEle(i).nodeObj, f = Un(e, t), p = Infinity, m = 0, h = 0, g = 0, v = 0, y = Infinity, b = 0;
	for (let t = a; t <= o; t++) {
		let n = d.children?.[t];
		if (!n) return console.warn("Child not found"), null;
		let r = Vn(e.findEle(n.id)), { offsetLeft: i, offsetTop: s } = _(c, r), l = a === o ? 10 : 20;
		t === a && (h = s + l), t === o && (g = s + r.offsetHeight - l), t === a && (y = i + l), t === o && (b = i + r.offsetWidth - l), s + r.offsetHeight > v && (v = s + r.offsetHeight), i < p && (p = i), r.offsetWidth + i > m && (m = r.offsetWidth + i);
	}
	let x, S, C = s?.stroke || l.cssVar["--color"], w = s?.labelColor || l.cssVar["--color"], T = "s-" + n, E = e.markdown ? e.markdown(r, t) : r;
	if (f === A.DOWN) {
		let e = v + 10, t = (y + b) / 2;
		x = Bn(`M ${y} ${e - 10} c 0 5 5 10 10 10 L ${b - 10} ${e} c 5 0 10 -5 10 -10 M ${t} ${e} v 10`, C), S = B(E, t, e + 20, {
			anchor: "middle",
			color: w,
			dataType: "summary",
			svgId: T
		});
	} else {
		let e = d.parent ? 10 : 0, t = h + e, n = g + e, r = (t + n) / 2;
		f === A.LHS ? (x = Bn(`M ${p + 10} ${t} c -5 0 -10 5 -10 10 L ${p} ${n - 10} c 0 5 5 10 10 10 M ${p} ${r} h -10`, C), S = B(E, p - 20, r, {
			anchor: "end",
			color: w,
			dataType: "summary",
			svgId: T
		})) : (x = Bn(`M ${m - 10} ${t} c 5 0 10 5 10 10 L ${m} ${n - 10} c 0 5 -5 10 -10 10 M ${m} ${r} h 10`, C), S = B(E, m + 20, r, {
			anchor: "start",
			color: w,
			dataType: "summary",
			svgId: T
		}));
	}
	let D = zn(T);
	return D.appendChild(x), e.labelContainer.appendChild(S), z(S), D.summaryObj = t, D.labelEl = S, u.appendChild(D), D;
}, Gn = function(e = {}) {
	if (!this.currentNodes) return;
	let { currentNodes: t, summaries: n, bus: r } = this, { parent: i, start: a, end: o } = Rn(t), s = {
		id: m(),
		parent: i,
		start: a,
		end: o,
		label: "summary",
		style: e.style
	}, c = Wn(this, s);
	n.push(s), this.editSummary(c), r.fire("operation", {
		name: "createSummary",
		target: s
	});
}, Kn = function(e) {
	let t = m(), n = {
		...e,
		id: t
	};
	Wn(this, n), this.summaries.push(n), this.bus.fire("operation", {
		name: "createSummary",
		target: n
	});
}, qn = function(e) {
	let t = this.summaries.find((t) => t.id === e);
	!t || !Hn(this, e) || this.bus.fire("operation", {
		name: "removeSummary",
		target: t
	});
}, Jn = function(e) {
	let t = e.labelEl;
	t && t.classList.add("selected"), this.currentSummary = e, this.bus.fire("selectSummary", e.summaryObj);
}, Yn = function() {
	this.currentSummary?.labelEl?.classList.remove("selected"), this.currentSummary = null, this.bus.fire("unselectSummary");
}, Xn = function() {
	this.summarySvg.innerHTML = "";
	let e = [];
	this.summaries.forEach((t) => {
		try {
			Wn(this, t) === null && e.push(t.id);
		} catch {
			console.warn("Node may not be expanded");
		}
	}), e.forEach((e) => Hn(this, e)), this.nodes.insertAdjacentElement("beforeend", this.summarySvg);
}, Zn = function(e) {
	e && e.labelEl && Lt(this, e.labelEl, e.summaryObj);
};
//#endregion
//#region src/methods.ts
function Qn(e, t) {
	return async function(...n) {
		let r = this.before[t];
		r && !await r.apply(this, n) || e.apply(this, n);
	};
}
var $n = Object.keys(Ee), er = {};
for (let e = 0; e < $n.length; e++) {
	let t = $n[e];
	er[t] = Qn(Ee[t], t);
}
var tr = {
	getObjById: l,
	generateNewObj: h,
	layout: ce,
	linkDiv: Rt,
	editTopic: ve,
	createWrapper: pe,
	createParent: me,
	createChildren: he,
	createTopic: ge,
	findEle: de,
	changeTheme: pn,
	changeCompact: mn,
	...Ue,
	...er,
	...gn,
	...Ln,
	async init(e) {
		if (!this.pluginsInitialized) {
			if (e = JSON.parse(JSON.stringify(e)), !e || !e.nodeData) return /* @__PURE__ */ Error("MindElixir: `data` is required");
			e.direction !== void 0 && (this.direction = e.direction), e.compact !== void 0 && (this.compact = e.compact), this.changeTheme(e.theme || this.theme, !1), e.meta && (this.meta = e.meta), this.nodeData = e.nodeData, u(this.nodeData), this.arrows = e.arrows || [], this.summaries = e.summaries || [], this.tidyArrow(), this.container.style.opacity = "0", this.layout(), await document.fonts.ready, this.linkDiv(), this.toCenter(), this.container.style.opacity = "", this.toolBar && qt(this), this.keypress && jt(this, this.keypress), ln(this), this.disposable.push(se(this)), this.contextMenu && this.disposable.push(Vt(this, this.contextMenu)), this.allowUndo && this.disposable.push(Ut(this)), this.pluginsInitialized = !0;
		}
	},
	destroy() {
		this.pluginsInitialized = !0, this.disposable.forEach((e) => e()), this.el && (this.el.innerHTML = ""), this.el = void 0, this.nodeData = void 0, this.arrows = void 0, this.summaries = void 0, this.currentArrow = void 0, this.currentNodes = void 0, this.currentSummary = void 0, this.theme = void 0, this.direction = void 0, this.bus = void 0, this.container = void 0, this.map = void 0, this.lines = void 0, this.linkController = void 0, this.arrowSvg = void 0, this.P2 = void 0, this.P3 = void 0, this.line1 = void 0, this.line2 = void 0, this.nodes = void 0, this.selection?.destroy(), this.selection = void 0;
	},
	enableMobileMultiSelect(e) {
		this.mobileMultiSelect = e;
	}
}, nr = "6.0.0-next.4";
//#endregion
//#region src/utils/panHelper.ts
function rr(e) {
	return {
		x: 0,
		y: 0,
		moved: !1,
		mousedown: !1,
		handlePointerDown(t) {
			this.moved = !1;
			let n = t.target, r = e.mouseSelectionButton === 0 ? 2 : 0, i = e.spacePressed && t.button === 0 && t.pointerType === "mouse", a = !e.editable || t.button === r && t.pointerType === "mouse" || t.pointerType === "touch";
			!i && !a || (this.x = t.clientX, this.y = t.clientY, n.className !== "circle" && n.contentEditable !== "plaintext-only" && (this.mousedown = !0, n.setPointerCapture(t.pointerId)));
		},
		handlePointerMove(t) {
			if (!this.mousedown || t.target.contentEditable === "plaintext-only" && !e.spacePressed) return !1;
			let n = t.clientX - this.x, r = t.clientY - this.y;
			return this.x = t.clientX, this.y = t.clientY, this.moved = !0, e.move(n, r), !0;
		},
		handlePointerUp(e) {
			if (!this.mousedown) return;
			let t = e.target;
			t.hasPointerCapture && t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), this.mousedown = !1;
		},
		clear() {
			this.mousedown = !1, this.moved = !1;
		}
	};
}
//#endregion
//#region src/index.ts
var ir = class {
	static LEFT = 0;
	static RIGHT = 1;
	static SIDE = 2;
	static DOWN = 3;
	static THEME = o;
	static DARK_THEME = s;
	static version = nr;
	static E = de;
	static new = (e) => ({ nodeData: {
		id: m(),
		topic: e || "new topic",
		children: []
	} });
	get currentNode() {
		return this.currentNodes[this.currentNodes.length - 1];
	}
	constructor({ el: e, direction: t, editable: n, contextMenu: r, toolBar: i, keypress: a, mouseSelectionButton: c, selectionContainer: l, before: u, newTopicName: d, allowUndo: f, generateMainBranch: p, generateSubBranch: m, overflowHidden: h, compact: g, theme: _, alignment: v, scaleSensitivity: y, scaleMax: b, scaleMin: x, handleWheel: S, markdown: C, imageProxy: w, pasteHandler: T, mobileMultiSelect: E }) {
		let D = null, O = Object.prototype.toString.call(e);
		if (O === "[object HTMLDivElement]" ? D = e : O === "[object String]" && (D = document.querySelector(e)), !D) throw Error("MindElixir: el is not a valid element");
		D.style.position = "relative", D.innerHTML = "", this.el = D, this.disposable = [], this.pluginsInitialized = !1, this.before = u || {}, this.newTopicName = d || "New Node", this.contextMenu = r ?? !0, this.toolBar = i ?? !0, this.keypress = a ?? !0, this.mouseSelectionButton = c ?? 0, this.direction = t ?? 1, this.editable = n ?? !0, this.allowUndo = f ?? !0, this.scaleSensitivity = y ?? .1, this.scaleMax = b ?? 1.4, this.scaleMin = x ?? .2, this.generateMainBranch = p || dn, this.generateSubBranch = m || fn, this.overflowHidden = h ?? !1, this.compact = g ?? !1, this.alignment = v ?? "root", this.handleWheel = S ?? !0, this.markdown = C || void 0, this.imageProxy = w || void 0, this.currentNodes = [], this.currentArrow = null, this.scaleVal = 1, this.tempDirection = null, this.mobileMultiSelect = E ?? !1, this.panHelper = rr(this), this.bus = Nt(), this.container = document.createElement("div"), this.selectionContainer = l || this.container, this.container.className = "map-container";
		let ee = window.matchMedia("(prefers-color-scheme: dark)");
		this.theme = _ || (ee.matches ? s : o);
		let k = document.createElement("div");
		k.className = "map-canvas", this.map = k, this.container.setAttribute("tabindex", "0"), this.container.appendChild(this.map), this.el.appendChild(this.container), this.nodes = document.createElement("div"), this.nodes.className = "me-nodes", this.lines = V("lines"), this.summarySvg = V("summary"), this.linkController = V("linkcontroller"), this.P2 = document.createElement("div"), this.P3 = document.createElement("div"), this.P2.className = this.P3.className = "circle", this.P2.style.display = this.P3.style.display = "none", this.line1 = Ft(), this.line2 = Ft(), this.linkController.appendChild(this.line1), this.linkController.appendChild(this.line2), this.arrowSvg = V("topiclinks"), this.labelContainer = document.createElement("div"), this.labelContainer.className = "label-container", this.map.appendChild(this.nodes), this.overflowHidden ? this.container.style.overflow = "hidden" : this.disposable.push(Mt(this)), T && (this.pasteHandler = T);
	}
};
Object.assign(ir.prototype, tr);
//#endregion
module.exports = { "DARK_THEME": s, "DOWN": a, "LEFT": n, "RIGHT": r, "SIDE": i, "THEME": o, "default": ir, "generateUUID": m };

  return module.exports;
})();
// Expose the MindElixir class (ESM default) plus its statics directly, so the
// canvas can construct it with new and read statics like SIDE/THEME off the class.
window.__DSH_MINDE_MINDELIXIR__ = MindElixir.default ?? MindElixir;
Object.assign(window.__DSH_MINDE_MINDELIXIR__, MindElixir);

// Inject MindElixir stylesheet once.
(function () {
  if (typeof document === "undefined") return;
  var tagId = "dsh-mindmap-live/MindElixir.css";
  if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]")) return;
  var tag = document.createElement("style");
  tag.dataset.plugin = "dsh-mindmap-live";
  tag.dataset.pluginCss = tagId;
  tag.textContent = ".map-container p{margin:0}.map-container{-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;touch-action:none;outline:none;width:100%;height:100%;font-family:-apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;font-size:16px;overflow:hidden}.map-container *{box-sizing:border-box}.map-container::-webkit-scrollbar{width:0;height:0}.map-container .selected{outline:2px solid var(--selected);outline-offset:1px}.map-container.space-pressed,.map-container.space-pressed *{cursor:grab!important}.map-container.space-pressed:active,.map-container.space-pressed:active *{cursor:grabbing!important}.map-container .hyper-link{margin-left:.3em;text-decoration:none}.map-container .me-main>.me-wrapper>.me-parent>.me-epd{top:calc(50% - 9px)}.map-container .me-epd{top:calc(100% - 9px)}.map-container .lhs{direction:rtl}.map-container .lhs>.me-wrapper>.me-parent>.me-epd{left:-10px}.map-container .lhs .me-epd{left:5px}.map-container .lhs .me-tpc{direction:ltr}.map-container .rhs>.me-wrapper>.me-parent>.me-epd{right:-10px}.map-container .rhs .me-epd{right:5px}.map-container .me-nodes.down{flex-direction:column}.map-container .me-nodes.down .me-main{flex-direction:row;justify-content:center;align-items:flex-start;display:flex}.map-container .me-nodes.down>.me-main>.me-wrapper{margin:var(--main-gap-x) var(--main-gap-y)}.map-container .me-nodes.down .me-wrapper{flex-direction:column;align-items:center;display:flex}.map-container .me-nodes.down .me-children{margin-top:var(--node-gap-x);flex-direction:row;justify-content:center;align-items:flex-start;display:flex}.map-container .me-nodes.down .me-parent{padding:0 var(--node-gap-y);margin:0}.map-container .me-nodes.down .me-children .me-parent>.me-tpc{border:1px solid var(--main-color);background-color:var(--main-bgcolor);border-radius:6px;padding:6px 12px}.map-container .me-nodes.down .me-epd,.map-container .me-nodes.down>.me-main>.me-wrapper>.me-parent>.me-epd{top:calc(100% - 9px);left:calc(50% - 9px);right:auto}.map-container .me-nodes.down .insert-preview.before{width:14px;height:100%;top:0;left:-14px}.map-container .me-nodes.down .insert-preview.after{width:14px;height:100%;top:0;left:auto;right:-14px}.map-container{background-color:var(--bgcolor)}.map-container .map-canvas{pointer-events:none;-webkit-user-select:none;user-select:none;width:fit-content;position:relative;transform:scale(1)}.map-container .map-canvas .me-nodes{width:max-content;height:max-content;padding:var(--map-padding);justify-content:center;align-items:center;display:flex;position:relative}.map-container .me-main>.me-wrapper{margin:var(--main-gap-y) var(--main-gap-x);position:relative}.map-container .me-main>.me-wrapper>.me-parent{margin:10px;padding:0}.map-container .me-main>.me-wrapper>.me-parent>.me-tpc{border-radius:var(--main-radius);background-color:var(--main-bgcolor);border:var(--main-border,2px solid var(--main-color));color:var(--main-color);padding:8px 25px}.map-container .me-wrapper{width:fit-content;display:block}.map-container .me-children,.map-container .me-parent{vertical-align:middle;display:inline-block}.map-container .me-root{z-index:10;margin:45px 0;position:relative}.map-container .me-root .me-tpc{color:var(--root-color);border-radius:var(--root-radius);border:var(--root-border-color) 2px solid;background-color:var(--root-bgcolor);padding:10px 30px;font-size:25px}.map-container .me-parent{cursor:pointer;padding:6px var(--node-gap-x);margin-top:var(--node-gap-y);z-index:10;position:relative}.map-container .me-parent .me-tpc{color:var(--color);padding:var(--topic-padding);border-radius:3px;position:relative}.map-container .me-parent .me-tpc .insert-preview{z-index:9;width:100%;position:absolute;left:0}.map-container .me-parent .me-tpc .show{pointer-events:none;opacity:.7;background:#7ad5ff;border-radius:3px}.map-container .me-parent .me-tpc .before{height:14px;top:-14px}.map-container .me-parent .me-tpc .in{height:100%;top:0}.map-container .me-parent .me-tpc .after{height:14px;bottom:-14px}.map-container .me-parent .me-epd{opacity:.8;pointer-events:all;z-index:9;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdD0iMTY1NjY1NDcxNzI0MiIgY2xhc3M9Imljb24iIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIKICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgICA8cGF0aCBkPSJNNTEyIDc0LjY2NjY2N0MyNzAuOTMzMzMzIDc0LjY2NjY2NyA3NC42NjY2NjcgMjcwLjkzMzMzMyA3NC42NjY2NjcgNTEyUzI3MC45MzMzMzMgOTQ5LjMzMzMzMyA1MTIgOTQ5LjMzMzMzMyA5NDkuMzMzMzMzIDc1My4wNjY2NjcgOTQ5LjMzMzMzMyA1MTIgNzUzLjA2NjY2NyA3NC42NjY2NjcgNTEyIDc0LjY2NjY2N3oiIHN0cm9rZS13aWR0aD0iNTQiIHN0cm9rZT0nYmxhY2snIGZpbGw9J3doaXRlJyA+PC9wYXRoPgogICAgPHBhdGggZD0iTTY4Mi42NjY2NjcgNDgwaC0xMzguNjY2NjY3VjM0MS4zMzMzMzNjMC0xNy4wNjY2NjctMTQuOTMzMzMzLTMyLTMyLTMycy0zMiAxNC45MzMzMzMtMzIgMzJ2MTM4LjY2NjY2N0gzNDEuMzMzMzMzYy0xNy4wNjY2NjcgMC0zMiAxNC45MzMzMzMtMzIgMzJzMTQuOTMzMzMzIDMyIDMyIDMyaDEzOC42NjY2NjdWNjgyLjY2NjY2N2MwIDE3LjA2NjY2NyAxNC45MzMzMzMgMzIgMzIgMzJzMzItMTQuOTMzMzMzIDMyLTMydi0xMzguNjY2NjY3SDY4Mi42NjY2NjdjMTcuMDY2NjY3IDAgMzItMTQuOTMzMzMzIDMyLTMycy0xNC45MzMzMzMtMzItMzItMzJ6Ij48L3BhdGg+Cjwvc3ZnPg==);background-position:50%;background-repeat:no-repeat;background-size:contain;width:18px;height:18px;position:absolute}.map-container .me-parent .me-epd.minus{opacity:0;transition:opacity .3s;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdD0iMTY1NjY1NTU2NDk4NSIgY2xhc3M9Imljb24iIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIKICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgICA8cGF0aCBkPSJNNTEyIDc0LjY2NjY2N0MyNzAuOTMzMzMzIDc0LjY2NjY2NyA3NC42NjY2NjcgMjcwLjkzMzMzMyA3NC42NjY2NjcgNTEyUzI3MC45MzMzMzMgOTQ5LjMzMzMzMyA1MTIgOTQ5LjMzMzMzMyA5NDkuMzMzMzMzIDc1My4wNjY2NjcgOTQ5LjMzMzMzMyA1MTIgNzUzLjA2NjY2NyA3NC42NjY2NjcgNTEyIDc0LjY2NjY2N3oiIHN0cm9rZS13aWR0aD0iNTQiIHN0cm9rZT0nYmxhY2snIGZpbGw9J3doaXRlJyA+PC9wYXRoPgogICAgPHBhdGggZD0iTTY4Mi42NjY2NjcgNTQ0SDM0MS4zMzMzMzNjLTE3LjA2NjY2NyAwLTMyLTE0LjkzMzMzMy0zMi0zMnMxNC45MzMzMzMtMzIgMzItMzJoMzQxLjMzMzMzNGMxNy4wNjY2NjcgMCAzMiAxNC45MzMzMzMgMzIgMzJzLTE0LjkzMzMzMyAzMi0zMiAzMnoiPjwvcGF0aD4KPC9zdmc+)!important}@media (hover:hover){.map-container .me-parent .me-epd.minus:hover{opacity:.8}}@media (hover:none){.map-container .me-parent .me-epd.minus{opacity:.8}}.map-container .icon{vertical-align:-.15em;fill:currentColor;width:1em;height:1em;overflow:hidden}.map-container .lines,.map-container .summary,.map-container .subLines,.map-container .topiclinks,.map-container .linkcontroller{width:100%;height:102%;position:absolute;top:0;left:0}.map-container .topiclinks,.map-container .linkcontroller,.map-container .summary{pointer-events:none;z-index:20}.map-container .summary>g,.map-container .topiclinks>g{cursor:pointer;pointer-events:stroke;z-index:20}.map-container .label-container{z-index:21}.map-container .lines,.map-container .subLines{pointer-events:none}.map-container #input-box{-webkit-user-select:auto;user-select:auto;pointer-events:auto;width:max-content;max-width:35em;color:var(--color);background-color:var(--bgcolor);z-index:100;direction:ltr;border-radius:3px;outline:1px solid #ccc;position:absolute;top:0;left:0}.map-container .me-tpc{white-space:pre-wrap;pointer-events:all;max-width:35em;display:block}.map-container .me-tpc>*{pointer-events:none}.map-container .me-tpc>a,.map-container .me-tpc>iframe{pointer-events:auto}.map-container .me-tpc>.text{display:inline-block}.map-container .me-tpc>.text a{pointer-events:auto}.map-container .me-tpc>img{object-fit:cover;margin-bottom:8px;display:block}.map-container .circle{pointer-events:all;z-index:50;cursor:pointer;background:#757575;border:2px solid #fff;border-radius:100%;width:10px;height:10px;margin-top:-5px;margin-left:-5px;position:absolute}.map-container .circle:before{content:\"\";background:0 0;width:30px;height:30px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.map-container .tags{direction:ltr;font-size:12px}.map-container .tags span{color:#276f86;background:#d6f0f8;border-radius:3px;margin:4px 4px 0 0;padding:2px 4px;line-height:1.3em;display:inline-block}.map-container .icons{direction:ltr;margin-left:5px;display:inline-block}.map-container .icons span{line-height:1.3em;display:inline-block}.map-container .mind-elixir-ghost{box-sizing:content-box;opacity:.7;background-color:var(--main-bgcolor);border:2px solid var(--main-color);color:var(--main-color);white-space:nowrap;text-overflow:ellipsis;pointer-events:none;z-index:1000;scrollbar-width:none;border-radius:6px;width:fit-content;max-width:200px;padding:8px 16px;display:none;position:absolute;top:0;left:0;overflow:hidden}.map-container .mind-elixir-ghost::-webkit-scrollbar{width:0;height:0;display:none}.map-container .mind-elixir-ghost ::-webkit-scrollbar{width:0;height:0;display:none}.map-container .selection-area{background:#4f90f22d;border:1px solid #4f90f2}.map-container .svg-label{overflow-wrap:break-word;-webkit-hyphens:auto;hyphens:auto;pointer-events:auto;cursor:pointer;z-index:10;width:max-content;max-width:200px;line-height:1.2;position:absolute}.map-container .svg-label:has(.katex){max-width:none}.map-container .svg-label{padding:var(--topic-padding);border-radius:3px}.map-container .svg-label[data-type=arrow]{background-color:var(--main-bgcolor-transparent)}.map-container h1{color:var(--selected);font-size:1.5rem;font-weight:700}.map-container h2{color:var(--selected);font-size:1.25rem;font-weight:600}.map-container h3{color:var(--selected);font-size:1.125rem;font-weight:600}.map-container h4{color:var(--selected);font-size:1rem;font-weight:600}.map-container h5{color:var(--selected);font-size:.875rem;font-weight:600}.map-container h6{color:var(--selected);margin:.1rem 0;font-size:.875rem;font-style:italic;font-weight:500}.map-container strong.asterisk-emphasis,.map-container em{color:var(--selected)}.map-container strong.underscore-emphasis{background:#ffeb3b40;border-radius:.15em;padding:.05em .15em}.map-container a{color:var(--selected)}.map-container a:hover{color:var(--selected);text-decoration:underline}.map-container .context-menu{z-index:99;width:100%;height:100%;position:fixed;top:0;left:0}.map-container .context-menu .menu-list{color:var(--panel-color);border-radius:5px;margin:0;padding:0;list-style:none;position:fixed;overflow:hidden;box-shadow:0 12px 15px #0003}.map-container .context-menu .menu-list li{white-space:nowrap;background:var(--panel-bgcolor);border-bottom:1px solid var(--panel-border-color);cursor:pointer;min-width:200px;padding:6px 10px;overflow:hidden}.map-container .context-menu .menu-list li span{line-height:20px}.map-container .context-menu .menu-list li a{color:#333;text-decoration:none}.map-container .context-menu .menu-list li.disabled{display:none}.map-container .context-menu .menu-list li:hover{filter:brightness(.95)}.map-container .context-menu .menu-list li:last-child{border-bottom:0}.map-container .context-menu .menu-list li span:last-child{float:right}.map-container .context-menu .key{color:#333;background-color:#f1f1f1;border-radius:3px;padding:2px 5px;font-size:10px}.map-container .tips{color:var(--panel-color);background:var(--panel-bgcolor);opacity:.8;border-radius:5px;padding:5px 10px;font-weight:700;position:absolute;bottom:28px;left:50%;transform:translate(-50%)}.mind-elixir-toolbar{color:var(--panel-color);background:var(--panel-bgcolor);border-radius:5px;padding:10px;position:absolute;box-shadow:0 1px 2px #0003}.mind-elixir-toolbar svg{display:inline-block}.mind-elixir-toolbar span:active{opacity:.5}.mind-elixir-toolbar.rb{bottom:20px;right:20px}.mind-elixir-toolbar.rb span+span{margin-left:10px}.mind-elixir-toolbar.lt{font-size:20px;top:20px;left:20px}.mind-elixir-toolbar.lt span{display:block}.mind-elixir-toolbar.lt span+span{margin-top:10px}\n/*$vite$:1*/";
  document.head.appendChild(tag);
})();

// Official @mind-elixir plugins (see pluginsSection above).
var MINDMAP_EXPORT_PLUGIN = (function () {
  var module = { exports: {} };
  var exports = module.exports;
(function(s,h){typeof exports=="object"&&typeof module<"u"?h(exports):typeof define=="function"&&define.amd?define(["exports"],h):(s=typeof globalThis<"u"?globalThis:s||self,h(s.ExportMindmap={}))})(this,function(s){"use strict";const h='var MindElixirLite=(function(Y){"use strict";const j={name:"Latte",type:"light",palette:["#dd7878","#ea76cb","#8839ef","#e64553","#fe640b","#df8e1d","#40a02b","#209fb5","#1e66f5","#7287fd"],cssVar:{"--node-gap-x":"30px","--node-gap-y":"10px","--main-gap-x":"65px","--main-gap-y":"45px","--root-radius":"30px","--main-radius":"20px","--root-color":"#ffffff","--root-bgcolor":"#4c4f69","--root-border-color":"rgba(0, 0, 0, 0)","--main-color":"#444446","--main-bgcolor":"#ffffff","--main-bgcolor-transparent":"rgba(255, 255, 255, 0.8)","--topic-padding":"3px","--color":"#777777","--bgcolor":"#f6f6f6","--selected":"#4dc4ff","--accent-color":"#e64553","--panel-color":"#444446","--panel-bgcolor":"#ffffff","--panel-border-color":"#eaeaea","--map-padding":"50px 80px"}},_={name:"Dark",type:"dark",palette:["#848FA0","#748BE9","#D2F9FE","#4145A5","#789AFA","#706CF4","#EF987F","#775DD5","#FCEECF","#DA7FBC"],cssVar:{"--node-gap-x":"30px","--node-gap-y":"10px","--main-gap-x":"65px","--main-gap-y":"45px","--root-radius":"30px","--main-radius":"20px","--root-color":"#ffffff","--root-bgcolor":"#2d3748","--root-border-color":"rgba(255, 255, 255, 0.1)","--main-color":"#ffffff","--main-bgcolor":"#4c4f69","--main-bgcolor-transparent":"rgba(76, 79, 105, 0.8)","--topic-padding":"3px","--color":"#cccccc","--bgcolor":"#252526","--selected":"#4dc4ff","--accent-color":"#789AFA","--panel-color":"#ffffff","--panel-bgcolor":"#2d3748","--panel-border-color":"#696969","--map-padding":"50px 80px"}};function It(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}const U=function(t,e){if(e.id===t)return e;if(e.children&&e.children.length){for(let n=0;n<e.children.length;n++){const o=U(t,e.children[n]);if(o)return o}return null}else return null},it=(t,e)=>{if(t.parent=e,t.children)for(let n=0;n<t.children.length;n++)it(t.children[n],t)},pt=(t,e,n)=>{t.expanded=e,t.children&&t.children.forEach(o=>{pt(o,e)})};function K(t,e,n,o){const s=n-t,i=o-e,c=Math.atan2(i,s)*180/Math.PI,a=12,l=30,h=(c+180-l)*Math.PI/180,f=(c+180+l)*Math.PI/180;return{x1:n+Math.cos(h)*a,y1:o+Math.sin(h)*a,x2:n+Math.cos(f)*a,y2:o+Math.sin(f)*a}}function z(){return(new Date().getTime().toString(16)+Math.random().toString(16).substring(2)).substring(2,18)}const Ot=function(){const t=z();return{topic:this.newTopicName,id:t}},H=(t,e)=>{let n=0,o=0;for(;e&&e!==t;)n+=e.offsetLeft,o+=e.offsetTop,e=e.offsetParent;return{offsetLeft:n,offsetTop:o}},D=(t,e)=>{for(const n in e)t.setAttribute(n,e[n])},rt=t=>t?t.tagName==="ME-TPC":!1,ct=t=>{const e=/translate3d\\(([^,]+),\\s*([^,]+)/,n=t.match(e);return n?{x:parseFloat(n[1]),y:parseFloat(n[2])}:{x:0,y:0}},gt=function(t){for(let e=0;e<t.length;e++){const{dom:n,evt:o,func:s}=t[e];n.addEventListener(o,s)}return function(){for(let n=0;n<t.length;n++){const{dom:o,evt:s,func:i}=t[n];o.removeEventListener(s,i)}}},mt=(t,e)=>{const n=t.x-e.x,o=t.y-e.y;return Math.sqrt(n*n+o*o)},X={LHS:"lhs",RHS:"rhs"},Yt=function(){this.nodes.innerHTML="";const t=this.createTopic(this.nodeData);vt.call(this,t,this.nodeData),t.draggable=!1;const e=document.createElement("me-root");e.appendChild(t);const n=this.nodeData.children||[];if(this.direction===2){let o=0,s=0;n.map(i=>{i.direction===0?o+=1:i.direction===1?s+=1:o<=s?(i.direction=0,o+=1):(i.direction=1,s+=1)})}Rt(this,n,e)},Rt=function(t,e,n){const o=document.createElement("me-main");o.className=X.LHS;const s=document.createElement("me-main");s.className=X.RHS;for(let i=0;i<e.length;i++){const r=e[i],{grp:c}=t.createWrapper(r);t.direction===2?r.direction===0?o.appendChild(c):s.appendChild(c):t.direction===0?o.appendChild(c):s.appendChild(c)}t.nodes.appendChild(o),t.nodes.appendChild(n),t.nodes.appendChild(s),t.nodes.appendChild(t.lines),t.nodes.appendChild(t.labelContainer)},Bt=function(t,e){const n=document.createElement("me-children");for(let o=0;o<e.length;o++){const s=e[o],{grp:i}=t.createWrapper(s);n.appendChild(i)}return n},yt=function(t,e){const o=(this?.el?this.el:e||document).querySelector(`[data-nodeid="me${t}"]`);if(!o)throw new Error(`FindEle: Node ${t} not found, maybe it\'s collapsed.`);return o},vt=function(t,e){if(t.innerHTML="",e.style){const n=e.style;for(const o in n)t.style[o]=n[o]}if(e.dangerouslySetInnerHTML){t.innerHTML=e.dangerouslySetInnerHTML;return}if(e.image){const n=e.image;if(n.url&&n.width&&n.height){const o=document.createElement("img");o.src=this.imageProxy?this.imageProxy(n.url):n.url,o.style.width=n.width+"px",o.style.height=n.height+"px",n.fit&&(o.style.objectFit=n.fit),t.appendChild(o),t.image=o}}else t.image&&(t.image=void 0);{const n=document.createElement("span");n.className="text",this.markdown?n.innerHTML=this.markdown(e.topic,e):n.textContent=e.topic,t.appendChild(n),t.text=n}if(e.hyperLink){const n=document.createElement("a");n.className="hyper-link",n.target="_blank",n.innerText="🔗",n.href=e.hyperLink,t.appendChild(n),t.link=n}else t.link&&(t.link=void 0);if(e.icons&&e.icons.length){const n=document.createElement("span");n.className="icons",n.innerHTML=e.icons.map(o=>`<span>${It(o)}</span>`).join(""),t.appendChild(n),t.icons=n}else t.icons&&(t.icons=void 0);if(e.tags&&e.tags.length){const n=document.createElement("div");n.className="tags",e.tags.forEach(o=>{const s=document.createElement("span");typeof o=="string"?s.textContent=o:(s.textContent=o.text,o.className&&(s.className=o.className),o.style&&Object.assign(s.style,o.style)),n.appendChild(s)}),t.appendChild(n),t.tags=n}else t.tags&&(t.tags=void 0)},Wt=function(t,e){const n=document.createElement("me-wrapper"),{p:o,tpc:s}=this.createParent(t);if(n.appendChild(o),!e&&t.children&&t.children.length>0){const i=Ft(t.expanded);if(o.appendChild(i),t.expanded!==!1){const r=Bt(this,t.children);n.appendChild(r)}}return{grp:n,top:o,tpc:s}},Xt=function(t){const e=document.createElement("me-parent"),n=this.createTopic(t);return vt.call(this,n,t),e.appendChild(n),{p:e,tpc:n}},Gt=function(t){const e=document.createElement("me-children");return e.append(...t),e},Vt=function(t){const e=document.createElement("me-tpc");return e.nodeObj=t,e.dataset.nodeid="me"+t.id,e};function wt(t){const e=document.createRange();e.selectNodeContents(t);const n=window.getSelection();n&&(n.removeAllRanges(),n.addRange(e))}const zt=function(t){if(!t)return;const e=document.createElement("div"),n=t.nodeObj,o=n.topic,{offsetLeft:s,offsetTop:i}=H(this.nodes,t);this.nodes.appendChild(e),e.id="input-box",e.textContent=o,e.contentEditable="plaintext-only",e.spellcheck=!1;const r=getComputedStyle(t);e.style.cssText=`\n  left: ${s}px;\n  top: ${i}px;\n  min-width:${t.offsetWidth-8}px;\n  color:${r.color};\n  font-size:${r.fontSize};\n  padding:${r.padding};\n  margin:${r.margin}; \n  background-color:${r.backgroundColor!=="rgba(0, 0, 0, 0)"&&r.backgroundColor};\n  border: ${r.border};\n  border-radius:${r.borderRadius}; `,this.direction===0&&(e.style.right="0"),wt(e),this.bus.fire("operation",{name:"beginEdit",obj:t.nodeObj}),e.addEventListener("keydown",c=>{c.stopPropagation();const a=c.key;if(a==="Enter"||a==="Tab"){if(c.shiftKey)return;c.preventDefault(),e.blur(),this.container.focus()}else a==="Escape"&&(c.preventDefault(),e.textContent=o,e.blur(),this.container.focus())}),e.addEventListener("blur",()=>{if(!e)return;e.remove();const c=e.innerText?.trim()||"";c===o||c===""||(n.topic=c,this.markdown?t.text.innerHTML=this.markdown(n.topic,n):t.text.textContent=c,this.linkDiv(),this.bus.fire("operation",{name:"finishEdit",obj:n,origin:o}))})},Ft=function(t){const e=document.createElement("me-epd");return e.expanded=t!==!1,e.className=t!==!1?"minus":"",e},qt=function(t){const n=t.parentElement.parentElement.lastElementChild;n?.tagName==="svg"&&n?.remove()};function jt(t){return{nodeData:t.isFocusMode?t.nodeDataBackup:t.nodeData,arrows:t.arrows,summaries:t.summaries,direction:t.direction,theme:t.theme}}const _t=function(t){const e=this.container,n=t.getBoundingClientRect(),o=e.getBoundingClientRect();if(n.top>o.bottom-50||n.bottom<o.top+50||n.left>o.right-50||n.right<o.left+50){const i=n.left+n.width/2,r=n.top+n.height/2,c=o.left+o.width/2,a=o.top+o.height/2,l=i-c,h=r-a;this.move(-l,-h,!0)}},Ut=function(t,e,n){this.clearSelection(),this.scrollIntoView(t),this.selection?.select(t),e&&this.bus.fire("selectNewNode",t.nodeObj)},Kt=function(t){this.selection?.select(t)},Jt=function(t){this.selection?.deselect(t)},Qt=function(){this.unselectNodes(this.currentNodes),this.unselectSummary(),this.unselectArrow()},bt=function(t){return JSON.stringify(t,(e,n)=>{if(!(e==="parent"&&typeof n!="string"))return n})},Zt=function(){const t=jt(this);return bt(t)},te=function(){return JSON.parse(this.getDataString())},ee=function(){this.editable=!0},ne=function(){this.editable=!1},oe=function(t,e={x:0,y:0}){if(t<this.scaleMin&&t<this.scaleVal||t>this.scaleMax&&t>this.scaleVal)return;const n=this.container.getBoundingClientRect(),o=e.x?e.x-n.left-n.width/2:0,s=e.y?e.y-n.top-n.height/2:0,{dx:i,dy:r}=lt(this),c=this.map.style.transform,{x:a,y:l}=ct(c),h=a-i,f=l-r,u=this.scaleVal,y=(-o+h)*(1-t/u),m=(-s+f)*(1-t/u);this.map.style.transform=`translate3d(${a-y}px, ${l-m}px, 0) scale(${t})`,this.scaleVal=t,this.bus.fire("scale",t)},se=function(){const t=this.nodes.offsetHeight/this.container.offsetHeight,e=this.nodes.offsetWidth/this.container.offsetWidth,n=1/Math.max(1,Math.max(t,e));this.scaleVal=n;const{dx:o,dy:s}=lt(this,!0);this.map.style.transform=`translate3d(${o}px, ${s}px, 0) scale(${n})`,this.bus.fire("scale",n)},ie=function(t,e,n=!1){const{map:o,scaleVal:s,bus:i,container:r,nodes:c}=this;if(n&&o.style.transition==="transform 0.3s")return;const a=o.style.transform;let{x:l,y:h}=ct(a);const f=r.getBoundingClientRect(),u=c.getBoundingClientRect(),y=u.left<f.right&&u.right>f.left,m=u.top<f.bottom&&u.bottom>f.top;if(y){const p=u.left+t,g=u.right+t;(p>=f.right||g<=f.left)&&(t=0)}if(m){const p=u.top+e,g=u.bottom+e;(p>=f.bottom||g<=f.top)&&(e=0)}l+=t,h+=e,n&&(o.style.transition="transform 0.3s",setTimeout(()=>{o.style.transition="none"},300)),o.style.transform=`translate3d(${l}px, ${h}px, 0) scale(${s})`,i.fire("move",{dx:t,dy:e})},lt=(t,e=!1)=>{const{container:n,map:o,nodes:s}=t;let i,r;if(t.alignment==="nodes"||e)i=(n.offsetWidth-s.offsetWidth)/2,r=(n.offsetHeight-s.offsetHeight)/2,o.style.transformOrigin="50% 50%";else{const c=o.querySelector("me-root"),a=c.offsetTop,l=c.offsetLeft,h=c.offsetWidth,f=c.offsetHeight;i=n.offsetWidth/2-l-h/2,r=n.offsetHeight/2-a-f/2,o.style.transformOrigin=`${l+h/2}px 50%`}return{dx:i,dy:r}},re=Object.freeze(Object.defineProperty({__proto__:null,cancelFocus:function(){this.isFocusMode=!1,this.tempDirection!==null&&(this.nodeData=this.nodeDataBackup,this.direction=this.tempDirection,this.tempDirection=null,this.refresh(),this.toCenter())},clearSelection:Qt,disableEdit:ne,enableEdit:ee,expandNode:function(t,e){const n=t.nodeObj;typeof e=="boolean"?n.expanded=e:n.expanded!==!1?n.expanded=!1:n.expanded=!0;const o=t.getBoundingClientRect(),s={x:o.left,y:o.top},i=t.parentNode,r=i.children[1];if(r.expanded=n.expanded,r.className=n.expanded?"minus":"",qt(t),n.expanded){const f=this.createChildren(n.children.map(u=>this.createWrapper(u).grp));i.parentNode.appendChild(f)}else i.parentNode.children[1].remove();this.linkDiv(t.closest("me-main > me-wrapper"));const c=t.getBoundingClientRect(),a={x:c.left,y:c.top},l=s.x-a.x,h=s.y-a.y;this.move(l,h),this.bus.fire("expandNode",n)},expandNodeAll:function(t,e){const n=t.nodeObj,o=t.getBoundingClientRect(),s={x:o.left,y:o.top};pt(n,e??!n.expanded),this.refresh();const i=this.findEle(n.id).getBoundingClientRect(),r={x:i.left,y:i.top},c=s.x-r.x,a=s.y-r.y;this.move(c,a)},focusNode:function(t){t.nodeObj.parent&&(this.clearSelection(),this.tempDirection===null&&(this.tempDirection=this.direction),this.isFocusMode||(this.nodeDataBackup=this.nodeData,this.isFocusMode=!0),this.nodeData=t.nodeObj,this.initRight(),this.toCenter())},getData:te,getDataString:Zt,initLeft:function(){this.direction=0,this.refresh(),this.toCenter(),this.bus.fire("changeDirection",this.direction)},initRight:function(){this.direction=1,this.refresh(),this.toCenter(),this.bus.fire("changeDirection",this.direction)},initSide:function(){this.direction=2,this.refresh(),this.toCenter(),this.bus.fire("changeDirection",this.direction)},install:function(t){t(this)},move:ie,refresh:function(t){this.clearSelection(),t&&(t=JSON.parse(JSON.stringify(t)),this.nodeData=t.nodeData,this.arrows=t.arrows||[],this.summaries=t.summaries||[],t.theme&&this.changeTheme(t.theme)),it(this.nodeData),this.layout(),this.linkDiv()},scale:oe,scaleFit:se,scrollIntoView:_t,selectNode:Ut,selectNodes:Kt,stringifyData:bt,toCenter:function(){const{map:t,container:e}=this,{dx:n,dy:o}=lt(this);e.scrollTop=0,e.scrollLeft=0,t.style.transform=`translate3d(${n}px, ${o}px, 0) scale(${this.scaleVal})`},unselectNodes:Jt},Symbol.toStringTag,{value:"Module"})),xt=function(t,e,n){const{scaleVal:o,scaleSensitivity:s}=t;switch(e){case"in":t.scale(o+s,n);break;case"out":t.scale(o-s,n)}},ce=function(t,e){if(!e)return J(t),t;let n=t.querySelector(".insert-preview");const o=`insert-preview ${e} show`;return n||(n=document.createElement("div"),t.appendChild(n)),n.className=o,t},J=function(t){if(!t)return;const e=t.querySelectorAll(".insert-preview");for(const n of e||[])n.remove()},Ct=function(t,e){for(const n of e){const o=n.parentElement.parentElement.contains(t);if(!(t&&t.tagName==="ME-TPC"&&t!==n&&!o&&t.nodeObj.parent))return!1}return!0},le=function(t){const e=document.createElement("div");return e.className="mind-elixir-ghost",t.container.appendChild(e),e};class ae{mind;isMoving=!1;interval=null;speed=20;constructor(e){this.mind=e}move(e,n){this.isMoving||(this.isMoving=!0,this.interval=setInterval(()=>{this.mind.move(e*this.speed*this.mind.scaleVal,n*this.speed*this.mind.scaleVal)},100))}stop(){this.isMoving=!1,this.interval&&(clearInterval(this.interval),this.interval=null)}}function de(t){return{isDragging:!1,insertType:null,meet:null,ghost:le(t),edgeMoveController:new ae(t),startX:0,startY:0,pointerId:null}}const he=5;function Et(t,e,n,o=!1){if(t.spacePressed)return!1;const s=n.target;if(s?.tagName!=="ME-TPC"||!s.nodeObj.parent)return!1;e.startX=n.clientX,e.startY=n.clientY,e.pointerId=n.pointerId,t.selection?.cancel();let i=t.currentNodes;return i?.includes(s)||(t.selectNode(s),i=t.currentNodes),t.dragged=i,o&&Tt(t,e),!0}function St(t,e,n){t.style.transform=`translate(${e-10}px, ${n-10}px)`,t.style.display="block"}function Tt(t,e){const{dragged:n}=t;if(!n)return;const o=document.activeElement;o&&o.isContentEditable&&o.blur(),e.isDragging=!0,n.length>1?e.ghost.innerHTML=n.length+"":e.ghost.innerHTML=n[0].innerHTML;for(const s of n)s.parentElement.parentElement.style.opacity="0.5";t.dragMoveHelper.clear()}function fe(t,e,n){const{dragged:o}=t;if(!o||e.pointerId!==n.pointerId)return;const s=n.clientX-e.startX,i=n.clientY-e.startY,r=Math.sqrt(s*s+i*i);if(!e.isDragging&&r>he&&Tt(t,e),!e.isDragging)return;const c=t.container.getBoundingClientRect();St(e.ghost,n.clientX-c.x,n.clientY-c.y),n.clientX<c.x+50?e.edgeMoveController.move(1,0):n.clientX>c.x+c.width-50?e.edgeMoveController.move(-1,0):n.clientY<c.y+50?e.edgeMoveController.move(0,1):n.clientY>c.y+c.height-50?e.edgeMoveController.move(0,-1):e.edgeMoveController.stop(),J(e.meet);const a=12*t.scaleVal,l=document.elementFromPoint(n.clientX,n.clientY-a);if(Ct(l,o)){e.meet=l;const h=l.getBoundingClientRect(),f=h.y;n.clientY>f+h.height?e.insertType="after":e.insertType="in"}else{const h=document.elementFromPoint(n.clientX,n.clientY+a);if(Ct(h,o)){e.meet=h;const u=h.getBoundingClientRect().y;n.clientY<u?e.insertType="before":e.insertType="in"}else e.insertType=null,e.meet=null}e.meet&&ce(e.meet,e.insertType)}function ue(t,e,n){const{dragged:o}=t;if(!(!o||e.pointerId!==n.pointerId)){e.edgeMoveController.stop();for(const s of o)s.parentElement.parentElement.style.opacity="1";e.ghost.style.display="none",e.ghost.innerHTML="",e.isDragging&&e.meet&&(J(e.meet),e.insertType==="before"?t.moveNodeBefore(o,e.meet):e.insertType==="after"?t.moveNodeAfter(o,e.meet):e.insertType==="in"&&t.moveNodeIn(o,e.meet)),t.dragged=null,e.isDragging=!1,e.insertType=null,e.meet=null,e.pointerId=null}}function at(t,e){const{dragged:n}=t;if(n){e.edgeMoveController.stop();for(const o of n)o.parentElement.parentElement.style.opacity="1";e.meet&&J(e.meet),e.ghost.style.display="none",e.ghost.innerHTML="",t.dragged=null,e.isDragging=!1,e.insertType=null,e.meet=null,e.pointerId=null}}function pe(t){const{dragMoveHelper:e}=t;let n=0;t.spacePressed=!1;let o=null;const s=new Map,i=de(t);let r=null,c=null,a=null,l=null;const h=500,f=10,u=()=>{r!==null&&(clearTimeout(r),r=null,c=null,a=null,l=null)},y=(d,v)=>{d.hasPointerCapture&&d.hasPointerCapture(v)&&d.releasePointerCapture(v)},m=(d,v)=>{if(d.id==="input-box"||d.closest("#input-box"))return!1;const E=d.closest(".svg-label");if(E){const A=E.dataset.svgId,st=E.dataset.type,q=document.getElementById(A);if(q){if(st==="arrow")return v?t.editArrowLabel(q):t.selectArrow(q),!0;if(st==="summary")return v?t.editSummary(q):t.selectSummary(q),!0}}if(d.closest(".topiclinks")){const A=d.closest("g");if(A)return v?t.editArrowLabel(A):t.selectArrow(A),!0}if(d.closest(".summary")){const A=d.closest("g");if(A)return v?t.editSummary(A):t.selectSummary(A),!0}return!1},p=d=>{if(d.button!==0)return;if(t.helper1?.moved){t.helper1.clear();return}if(t.helper2?.moved){t.helper2.clear();return}if(e.moved){e.clear();return}if(i?.isDragging)return;const v=d.target;if(v.tagName==="ME-EPD")d.ctrlKey||d.metaKey?t.expandNodeAll(v.previousSibling):t.expandNode(v.previousSibling);else if(v.tagName==="ME-TPC"&&t.currentNodes.length>1)t.selectNode(v);else if(!t.editable)return;m(v,!1)},g=d=>{if(!t.editable)return;const v=d.target;rt(v)&&t.beginEdit(v),m(v,!0)},b=d=>{if(d.pointerType==="mouse"||s.size>1)return;const v=new Date().getTime(),E=v-n;E<300&&E>0&&g(d),n=v},w=d=>{d.code==="Space"&&(t.spacePressed=!0,t.container.classList.add("space-pressed"))},x=d=>{d.code==="Space"&&(t.spacePressed=!1,t.container.classList.remove("space-pressed"))},S=d=>{if(d.pointerType==="touch"&&(s.set(d.pointerId,{x:d.clientX,y:d.clientY}),s.size===2)){const[A,st]=Array.from(s.values());o=mt(A,st),u()}e.moved=!1;const v=d.target,E=t.mouseSelectionButton===0?2:0;if(t.editable&&i&&(d.button===0||d.pointerType==="touch")){if(d.pointerType==="touch"&&s.size>1)(i.isDragging||i.pointerId!==null)&&at(t,i);else if(d.pointerType==="touch"&&s.size===1)(rt(v)||v.closest("me-tpc"))&&(c={x:d.clientX,y:d.clientY},a=v,l=d.pointerId,r=window.setTimeout(()=>{Et(t,i,d,!0)&&(a&&a.setPointerCapture(d.pointerId),St(i.ghost,d.clientX,d.clientY)),r=null,c=null,a=null,l=null},h));else if(d.pointerType==="mouse"&&Et(t,i,d,!1)){v.setPointerCapture(d.pointerId);return}}const $=t.spacePressed&&d.button===0&&d.pointerType==="mouse",W=!t.editable||d.button===E&&d.pointerType==="mouse"||d.pointerType==="touch";!$&&!W||(e.x=d.clientX,e.y=d.clientY,v.className!=="circle"&&v.contentEditable!=="plaintext-only"&&(e.mousedown=!0,v.setPointerCapture(d.pointerId)))},T=d=>{if(d.pointerType==="touch"&&s.has(d.pointerId)){if(s.set(d.pointerId,{x:d.clientX,y:d.clientY}),r!==null&&c!==null&&d.pointerId===l){const v=d.clientX-c.x,E=d.clientY-c.y;Math.sqrt(v*v+E*E)>f&&u()}if(s.size>=2){const[v,E]=Array.from(s.values()),$=mt(v,E);if(o==null)o=$;else{if(o>0){const W=$/o;t.scale(t.scaleVal*W,{x:(v.x+E.x)/2,y:(v.y+E.y)/2})}o=$}return}}if(!(i&&i.pointerId!==null&&(fe(t,i,d),i.isDragging))){if(d.target.contentEditable!=="plaintext-only"||t.spacePressed&&e.mousedown){const v=d.clientX-e.x,E=d.clientY-e.y;e.onMove(v,E)}e.x=d.clientX,e.y=d.clientY}},L=d=>{if(d.pointerType==="touch"&&(s.delete(d.pointerId),s.size<2&&(o=null),u()),i&&i.pointerId!==null){const v=i.isDragging;if(ue(t,i,d),y(d.target,d.pointerId),v)return}e.mousedown&&(y(d.target,d.pointerId),e.clear())},C=()=>{u(),e.mousedown&&e.clear(),i&&(i.isDragging||i.pointerId!==null)&&at(t,i)},N=d=>{d.pointerType==="touch"&&(s.delete(d.pointerId),s.size<2&&(o=null),u()),i&&i.pointerId===d.pointerId&&at(t,i),L(d)},M=d=>{if(d.preventDefault(),d.button!==2||!t.editable)return;const v=d.target;rt(v)&&!v.classList.contains("selected")&&t.selectNode(v),setTimeout(()=>{t.dragMoveHelper.moved||t.bus.fire("showContextMenu",d)},200)},R=d=>{d.stopPropagation(),d.preventDefault(),d.ctrlKey||d.metaKey?d.deltaY<0?xt(t,"in",t.dragMoveHelper):t.scaleVal-t.scaleSensitivity>0&&xt(t,"out",t.dragMoveHelper):d.shiftKey?t.move(-d.deltaY,0):t.move(-d.deltaX,-d.deltaY)},{container:k}=t;return gt([{dom:k,evt:"pointerdown",func:S},{dom:k,evt:"pointermove",func:T},{dom:k,evt:"pointerup",func:L},{dom:k,evt:"pointercancel",func:N},{dom:k,evt:"pointerdown",func:b},{dom:k,evt:"click",func:p},{dom:k,evt:"dblclick",func:g},{dom:k,evt:"contextmenu",func:M},{dom:k,evt:"wheel",func:typeof t.handleWheel=="function"?t.handleWheel:R},{dom:k,evt:"blur",func:C},{dom:k,evt:"keydown",func:w},{dom:k,evt:"keyup",func:x}])}function ge(){return{handlers:{},addListener:function(t,e){this.handlers[t]===void 0&&(this.handlers[t]=[]),this.handlers[t].push(e)},fire:function(t,...e){if(this.handlers[t]instanceof Array){const n=this.handlers[t];for(let o=0;o<n.length;o++)n[o](...e)}},removeListener:function(t,e){if(!this.handlers[t])return;const n=this.handlers[t];if(!e)n.length=0;else if(n.length)for(let o=0;o<n.length;o++)n[o]===e&&this.handlers[t].splice(o,1)}}}const I="http://www.w3.org/2000/svg",Q=function(t){const e=t.clientWidth,n=t.clientHeight,o=t.dataset,s=Number(o.x),i=Number(o.y),r=o.anchor;let c=s;r==="middle"?c=s-e/2:r==="end"&&(c=s-e),t.style.left=`${c}px`,t.style.top=`${i-n/2}px`,t.style.visibility="visible"},dt=function(t,e,n,o){const{anchor:s="middle",color:i,dataType:r,svgId:c}=o,a=document.createElement("div");a.className="svg-label",a.style.color=i||"#666";const l="label-"+c;return a.id=l,a.innerHTML=t,a.dataset.type=r,a.dataset.svgId=c,a.dataset.x=e.toString(),a.dataset.y=n.toString(),a.dataset.anchor=s,a},Lt=function(t,e,n){const o=document.createElementNS(I,"path");return D(o,{d:t,stroke:e||"#666",fill:"none","stroke-width":n}),o},F=function(t){const e=document.createElementNS(I,"svg");return e.setAttribute("class",t),e.setAttribute("overflow","visible"),e},Dt=function(){const t=document.createElementNS(I,"line");return t.setAttribute("stroke","#4dc4ff"),t.setAttribute("fill","none"),t.setAttribute("stroke-width","2"),t.setAttribute("opacity","0.45"),t},me=function(t,e,n,o){const s=document.createElementNS(I,"g");return[{name:"line",d:t},{name:"arrow1",d:e},{name:"arrow2",d:n}].forEach((r,c)=>{const a=r.d,l=document.createElementNS(I,"path"),h={d:a,stroke:o?.stroke||"rgb(227, 125, 116)",fill:"none","stroke-linecap":o?.strokeLinecap||"cap","stroke-width":String(o?.strokeWidth||"2")};o?.opacity!==void 0&&(h.opacity=String(o.opacity)),D(l,h),c===0&&l.setAttribute("stroke-dasharray",o?.strokeDasharray||"8,2");const f=document.createElementNS(I,"path");D(f,{d:a,stroke:"transparent",fill:"none","stroke-width":"15"}),s.appendChild(f),s.appendChild(l),s[r.name]=l}),s},Mt=function(t,e,n){if(!e)return;const o=n.label,s=e.cloneNode(!0);t.nodes.appendChild(s),s.id="input-box",s.textContent=o,s.contentEditable="plaintext-only",s.spellcheck=!1,s.style.cssText=`\n    left:${e.style.left};\n    top:${e.style.top}; \n    max-width: 200px;\n  `,wt(s),t.scrollIntoView(s),s.addEventListener("keydown",i=>{i.stopPropagation();const r=i.key;if(r==="Enter"||r==="Tab"){if(i.shiftKey)return;i.preventDefault(),s.blur(),t.container.focus()}}),s.addEventListener("blur",()=>{if(!s)return;const i=s.innerText?.trim()||"";i===""?n.label=o:n.label=i,s.remove(),i!==o&&(t.markdown?e.innerHTML=t.markdown(n.label,n):e.textContent=n.label,Q(e),"parent"in n?t.bus.fire("operation",{name:"finishEditSummary",obj:n}):t.bus.fire("operation",{name:"finishEditArrowLabel",obj:n}))})},ye=function(t){const e=this.map.querySelector("me-root"),n=e.offsetTop,o=e.offsetLeft,s=e.offsetWidth,i=e.offsetHeight,r=this.map.querySelectorAll("me-main > me-wrapper");this.lines.innerHTML="";for(let c=0;c<r.length;c++){const a=r[c],l=a.querySelector("me-tpc"),{offsetLeft:h,offsetTop:f}=H(this.nodes,l),u=l.offsetWidth,y=l.offsetHeight,m=a.parentNode.className,p=this.generateMainBranch({pT:n,pL:o,pW:s,pH:i,cT:f,cL:h,cW:u,cH:y,direction:m,containerHeight:this.nodes.offsetHeight}),g=this.theme.palette,b=l.nodeObj.branchColor||g[c%g.length];if(l.style.borderColor=b,this.lines.appendChild(Lt(p,b,"3")),t&&t!==a)continue;const w=F("subLines"),x=a.lastChild;x.tagName==="svg"&&x.remove(),a.appendChild(w),kt(this,w,b,a,m,!0)}this.labelContainer.innerHTML="",this.renderArrow(),this.renderSummary(),this.bus.fire("linkDiv")},kt=function(t,e,n,o,s,i){const r=o.firstChild,c=o.children[1].children;if(c.length===0)return;const a=r.offsetTop,l=r.offsetLeft,h=r.offsetWidth,f=r.offsetHeight;for(let u=0;u<c.length;u++){const y=c[u],m=y.firstChild,p=m.offsetTop,g=m.offsetLeft,b=m.offsetWidth,w=m.offsetHeight,x=m.firstChild.nodeObj.branchColor||n,S=t.generateSubBranch({pT:a,pL:l,pW:h,pH:f,cT:p,cL:g,cW:b,cH:w,direction:s,isFirst:i});e.appendChild(Lt(S,x,"2"));const T=m.children[1];if(T){if(!T.expanded)continue}else continue;kt(t,e,x,y,s)}},ve={side:\'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169394918" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2021" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M851.91168 328.45312c-59.97056 0-108.6208 48.47104-108.91264 108.36992l-137.92768 38.4a109.14304 109.14304 0 0 0-63.46752-46.58688l1.39264-137.11872c47.29344-11.86816 82.31936-54.66624 82.31936-105.64096 0-60.15488-48.76288-108.91776-108.91776-108.91776s-108.91776 48.76288-108.91776 108.91776c0 49.18784 32.60928 90.75712 77.38368 104.27392l-1.41312 138.87488a109.19936 109.19936 0 0 0-63.50336 48.55808l-138.93632-39.48544 0.01024-0.72704c0-60.15488-48.76288-108.91776-108.91776-108.91776s-108.91776 48.75776-108.91776 108.91776c0 60.15488 48.76288 108.91264 108.91776 108.91264 39.3984 0 73.91232-20.92032 93.03552-52.2496l139.19232 39.552-0.00512 0.2304c0 25.8304 9.00096 49.5616 24.02816 68.23424l-90.14272 132.63872a108.7488 108.7488 0 0 0-34.2528-5.504c-60.15488 0-108.91776 48.768-108.91776 108.91776 0 60.16 48.76288 108.91776 108.91776 108.91776 60.16 0 108.92288-48.75776 108.92288-108.91776 0-27.14624-9.9328-51.968-26.36288-71.04l89.04704-131.03104a108.544 108.544 0 0 0 37.6832 6.70208 108.672 108.672 0 0 0 36.48512-6.272l93.13792 132.57216a108.48256 108.48256 0 0 0-24.69888 69.0688c0 60.16 48.768 108.92288 108.91776 108.92288 60.16 0 108.91776-48.76288 108.91776-108.92288 0-60.14976-48.75776-108.91776-108.91776-108.91776a108.80512 108.80512 0 0 0-36.69504 6.3488l-93.07136-132.48a108.48768 108.48768 0 0 0 24.79616-72.22784l136.09984-37.888c18.99008 31.93856 53.84192 53.3504 93.69088 53.3504 60.16 0 108.92288-48.75776 108.92288-108.91264-0.00512-60.15488-48.77312-108.92288-108.92288-108.92288z" p-id="2022"></path></svg>\',left:\'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169375313" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1775" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M639 463.30000001L639 285.1c0-36.90000001-26.4-68.5-61.3-68.5l-150.2 0c-1.5 0-3 0.1-4.5 0.3-10.2-38.7-45.5-67.3-87.5-67.3-50 0-90.5 40.5-90.5 90.5s40.5 90.5 90.5 90.5c42 0 77.3-28.6 87.5-67.39999999 1.4 0.3 2.9 0.4 4.5 0.39999999L577.7 263.6c6.8 0 14.3 8.9 14.3 21.49999999l0 427.00000001c0 12.7-7.40000001 21.5-14.30000001 21.5l-150.19999999 0c-1.5 0-3 0.2-4.5 0.4-10.2-38.8-45.5-67.3-87.5-67.3-50 0-90.5 40.5-90.5 90.4 0 49.9 40.5 90.6 90.5 90.59999999 42 0 77.3-28.6 87.5-67.39999999 1.4 0.2 2.9 0.4 4.49999999 0.4L577.7 780.7c34.80000001 0 61.3-31.6 61.3-68.50000001L639 510.3l79.1 0c10.4 38.5 45.49999999 67 87.4 67 50 0 90.5-40.5 90.5-90.5s-40.5-90.5-90.5-90.5c-41.79999999 0-77.00000001 28.4-87.4 67L639 463.30000001z" fill="currentColor" p-id="1776"></path></svg>\',right:\'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169667709" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3037" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M385 560.69999999L385 738.9c0 36.90000001 26.4 68.5 61.3 68.5l150.2 0c1.5 0 3-0.1 4.5-0.3 10.2 38.7 45.5 67.3 87.5 67.3 50 0 90.5-40.5 90.5-90.5s-40.5-90.5-90.5-90.5c-42 0-77.3 28.6-87.5 67.39999999-1.4-0.3-2.9-0.4-4.5-0.39999999L446.3 760.4c-6.8 0-14.3-8.9-14.3-21.49999999l0-427.00000001c0-12.7 7.40000001-21.5 14.30000001-21.5l150.19999999 0c1.5 0 3-0.2 4.5-0.4 10.2 38.8 45.5 67.3 87.5 67.3 50 0 90.5-40.5 90.5-90.4 0-49.9-40.5-90.6-90.5-90.59999999-42 0-77.3 28.6-87.5 67.39999999-1.4-0.2-2.9-0.4-4.49999999-0.4L446.3 243.3c-34.80000001 0-61.3 31.6-61.3 68.50000001L385 513.7l-79.1 0c-10.4-38.5-45.49999999-67-87.4-67-50 0-90.5 40.5-90.5 90.5s40.5 90.5 90.5 90.5c41.79999999 0 77.00000001-28.4 87.4-67L385 560.69999999z" fill="currentColor" p-id="3038"></path></svg>\',full:\'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169402629" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2170" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M639.328 416c8.032 0 16.096-3.008 22.304-9.056l202.624-197.184-0.8 143.808c-0.096 17.696 14.144 32.096 31.808 32.192 0.064 0 0.128 0 0.192 0 17.6 0 31.904-14.208 32-31.808l1.248-222.208c0-0.672-0.352-1.248-0.384-1.92 0.032-0.512 0.288-0.896 0.288-1.408 0.032-17.664-14.272-32-31.968-32.032L671.552 96l-0.032 0c-17.664 0-31.968 14.304-32 31.968C639.488 145.632 653.824 160 671.488 160l151.872 0.224-206.368 200.8c-12.672 12.32-12.928 32.608-0.64 45.248C622.656 412.736 630.976 416 639.328 416z" p-id="2171"></path><path d="M896.032 639.552 896.032 639.552c-17.696 0-32 14.304-32.032 31.968l-0.224 151.872-200.832-206.4c-12.32-12.64-32.576-12.96-45.248-0.64-12.672 12.352-12.928 32.608-0.64 45.248l197.184 202.624-143.808-0.8c-0.064 0-0.128 0-0.192 0-17.6 0-31.904 14.208-32 31.808-0.096 17.696 14.144 32.096 31.808 32.192l222.24 1.248c0.064 0 0.128 0 0.192 0 0.64 0 1.12-0.32 1.76-0.352 0.512 0.032 0.896 0.288 1.408 0.288l0.032 0c17.664 0 31.968-14.304 32-31.968L928 671.584C928.032 653.952 913.728 639.584 896.032 639.552z" p-id="2172"></path><path d="M209.76 159.744l143.808 0.8c0.064 0 0.128 0 0.192 0 17.6 0 31.904-14.208 32-31.808 0.096-17.696-14.144-32.096-31.808-32.192L131.68 95.328c-0.064 0-0.128 0-0.192 0-0.672 0-1.248 0.352-1.888 0.384-0.448 0-0.8-0.256-1.248-0.256 0 0-0.032 0-0.032 0-17.664 0-31.968 14.304-32 31.968L96 352.448c-0.032 17.664 14.272 32 31.968 32.032 0 0 0.032 0 0.032 0 17.664 0 31.968-14.304 32-31.968l0.224-151.936 200.832 206.4c6.272 6.464 14.624 9.696 22.944 9.696 8.032 0 16.096-3.008 22.304-9.056 12.672-12.32 12.96-32.608 0.64-45.248L209.76 159.744z" p-id="2173"></path><path d="M362.368 617.056l-202.624 197.184 0.8-143.808c0.096-17.696-14.144-32.096-31.808-32.192-0.064 0-0.128 0-0.192 0-17.6 0-31.904 14.208-32 31.808l-1.248 222.24c0 0.704 0.352 1.312 0.384 2.016 0 0.448-0.256 0.832-0.256 1.312-0.032 17.664 14.272 32 31.968 32.032L352.448 928c0 0 0.032 0 0.032 0 17.664 0 31.968-14.304 32-31.968s-14.272-32-31.968-32.032l-151.936-0.224 206.4-200.832c12.672-12.352 12.96-32.608 0.64-45.248S375.008 604.704 362.368 617.056z" p-id="2174"></path></svg>\',living:\'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169573443" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2883" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M514.133333 488.533333m-106.666666 0a106.666667 106.666667 0 1 0 213.333333 0 106.666667 106.666667 0 1 0-213.333333 0Z" fill="currentColor" p-id="2884"></path><path d="M512 64C264.533333 64 64 264.533333 64 512c0 236.8 183.466667 428.8 416 445.866667v-134.4c-53.333333-59.733333-200.533333-230.4-200.533333-334.933334 0-130.133333 104.533333-234.666667 234.666666-234.666666s234.666667 104.533333 234.666667 234.666666c0 61.866667-49.066667 153.6-145.066667 270.933334l-59.733333 68.266666V960C776.533333 942.933333 960 748.8 960 512c0-247.466667-200.533333-448-448-448z" fill="currentColor" p-id="2885"></path></svg>\',zoomin:\'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169419447" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2480" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M863.328 482.56l-317.344-1.12L545.984 162.816c0-17.664-14.336-32-32-32s-32 14.336-32 32l0 318.4L159.616 480.064c-0.032 0-0.064 0-0.096 0-17.632 0-31.936 14.24-32 31.904C127.424 529.632 141.728 544 159.392 544.064l322.592 1.152 0 319.168c0 17.696 14.336 32 32 32s32-14.304 32-32l0-318.944 317.088 1.12c0.064 0 0.096 0 0.128 0 17.632 0 31.936-14.24 32-31.904C895.264 496.992 880.96 482.624 863.328 482.56z" p-id="2481"></path></svg>\',zoomout:\'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169426515" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2730" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M863.744 544 163.424 544c-17.664 0-32-14.336-32-32s14.336-32 32-32l700.32 0c17.696 0 32 14.336 32 32S881.44 544 863.744 544z" p-id="2731"></path></svg>\'},B=(t,e)=>{const n=document.createElement("span");return n.id=t,n.innerHTML=ve[e],n};function we(t){const e=document.createElement("div"),n=B("fullscreen","full"),o=B("toCenter","living"),s=B("zoomout","zoomout"),i=B("zoomin","zoomin");e.appendChild(n),e.appendChild(o),e.appendChild(s),e.appendChild(i),e.className="mind-elixir-toolbar rb";let r=null;const c=()=>{const l=t.container.getBoundingClientRect(),h=ct(t.map.style.transform),f=l.width/2,u=l.height/2,y=(f-h.x)/t.scaleVal,m=(u-h.y)/t.scaleVal;r={containerRect:l,currentTransform:h,mapCenterX:y,mapCenterY:m}},a=()=>{if(r){const l=t.container.getBoundingClientRect(),h=l.width/2,f=l.height/2,u=h-r.mapCenterX*t.scaleVal,y=f-r.mapCenterY*t.scaleVal,m=u-r.currentTransform.x,p=y-r.currentTransform.y;t.move(m,p)}};return t.el.addEventListener("fullscreenchange",a),n.onclick=()=>{c(),document.fullscreenElement!==t.el?t.el.requestFullscreen():document.exitFullscreen()},o.onclick=()=>{t.toCenter()},s.onclick=()=>{t.scale(t.scaleVal-t.scaleSensitivity)},i.onclick=()=>{t.scale(t.scaleVal+t.scaleSensitivity)},e}function be(t){const e=document.createElement("div"),n=B("tbltl","left"),o=B("tbltr","right"),s=B("tblts","side");return e.appendChild(n),e.appendChild(o),e.appendChild(s),e.className="mind-elixir-toolbar lt",n.onclick=()=>{t.initLeft()},o.onclick=()=>{t.initRight()},s.onclick=()=>{t.initSide()},e}function xe(t){t.container.append(we(t)),t.container.append(be(t))}const Ce=function(t,e=!0){this.theme=t;const o={...(t.type==="dark"?_:j).cssVar,...t.cssVar},s=Object.keys(o);for(let i=0;i<s.length;i++){const r=s[i];this.container.style.setProperty(r,o[r])}e&&this.refresh()},Nt={create:function(t){return{dom:t,moved:!1,pointerdown:!1,lastX:0,lastY:0,handlePointerMove(e){if(this.pointerdown){this.moved=!0;const n=e.clientX-this.lastX,o=e.clientY-this.lastY;this.lastX=e.clientX,this.lastY=e.clientY,this.cb&&this.cb(n,o)}},handlePointerDown(e){e.button===0&&(this.pointerdown=!0,this.lastX=e.clientX,this.lastY=e.clientY,this.dom.setPointerCapture(e.pointerId))},handleClear(e){this.pointerdown=!1,e.pointerId!==void 0&&this.dom.releasePointerCapture(e.pointerId)},cb:null,init(e,n){this.cb=n,this.handleClear=this.handleClear.bind(this),this.handlePointerMove=this.handlePointerMove.bind(this),this.handlePointerDown=this.handlePointerDown.bind(this),this.destroy=gt([{dom:e,evt:"pointermove",func:this.handlePointerMove},{dom:e,evt:"pointerleave",func:this.handleClear},{dom:e,evt:"pointerup",func:this.handleClear},{dom:this.dom,evt:"pointerdown",func:this.handlePointerDown}])},destroy:null,clear(){this.moved=!1,this.pointerdown=!1}}}},Ee="#4dc4ff";function At(t,e,n,o,s,i,r,c){return{x:t/8+n*3/8+s*3/8+r/8,y:e/8+o*3/8+i*3/8+c/8}}function Se(t,e,n){t&&(t.dataset.x=e.toString(),t.dataset.y=n.toString(),Q(t))}function Z(t,e,n,o,s){D(t,{x1:e+"",y1:n+"",x2:o+"",y2:s+""})}function Pt(t,e,n,o,s,i,r,c,a,l){const h=`M ${e} ${n} C ${o} ${s} ${i} ${r} ${c} ${a}`;if(t.line.setAttribute("d",h),l.style){const p=l.style;p.stroke&&t.line.setAttribute("stroke",p.stroke),p.strokeWidth&&t.line.setAttribute("stroke-width",String(p.strokeWidth)),p.strokeDasharray&&t.line.setAttribute("stroke-dasharray",p.strokeDasharray),p.strokeLinecap&&t.line.setAttribute("stroke-linecap",p.strokeLinecap),p.opacity!==void 0&&t.line.setAttribute("opacity",String(p.opacity))}const f=t.querySelectorAll(\'path[stroke="transparent"]\');f.length>0&&f[0].setAttribute("d",h);const u=K(i,r,c,a);if(u){const p=`M ${u.x1} ${u.y1} L ${c} ${a} L ${u.x2} ${u.y2}`;if(t.arrow1.setAttribute("d",p),f.length>1&&f[1].setAttribute("d",p),l.style){const g=l.style;g.stroke&&t.arrow1.setAttribute("stroke",g.stroke),g.strokeWidth&&t.arrow1.setAttribute("stroke-width",String(g.strokeWidth)),g.strokeLinecap&&t.arrow1.setAttribute("stroke-linecap",g.strokeLinecap),g.opacity!==void 0&&t.arrow1.setAttribute("opacity",String(g.opacity))}}if(l.bidirectional){const p=K(o,s,e,n);if(p){const g=`M ${p.x1} ${p.y1} L ${e} ${n} L ${p.x2} ${p.y2}`;if(t.arrow2.setAttribute("d",g),f.length>2&&f[2].setAttribute("d",g),l.style){const b=l.style;b.stroke&&t.arrow2.setAttribute("stroke",b.stroke),b.strokeWidth&&t.arrow2.setAttribute("stroke-width",String(b.strokeWidth)),b.strokeLinecap&&t.arrow2.setAttribute("stroke-linecap",b.strokeLinecap),b.opacity!==void 0&&t.arrow2.setAttribute("opacity",String(b.opacity))}}}const{x:y,y:m}=At(e,n,o,s,i,r,c,a);if(t.labelEl&&Se(t.labelEl,y,m),l.style?.labelColor){const p=t.labelEl;p&&(p.style.color=l.style.labelColor)}$e(t)}function tt(t,e,n){const{offsetLeft:o,offsetTop:s}=H(t.nodes,e),i=e.offsetWidth,r=e.offsetHeight,c=o+i/2,a=s+r/2,l=c+n.x,h=a+n.y;return{w:i,h:r,cx:c,cy:a,ctrlX:l,ctrlY:h}}function G(t){let e,n;const o=(t.cy-t.ctrlY)/(t.ctrlX-t.cx);return o>t.h/t.w||o<-t.h/t.w?t.cy-t.ctrlY<0?(e=t.cx-t.h/2/o,n=t.cy+t.h/2):(e=t.cx+t.h/2/o,n=t.cy-t.h/2):t.cx-t.ctrlX<0?(e=t.cx+t.w/2,n=t.cy-t.w*o/2):(e=t.cx-t.w/2,n=t.cy+t.w*o/2),{x:e,y:n}}const Te=function(t,e,n){const o=H(t.nodes,e),s=H(t.nodes,n),i=o.offsetLeft+e.offsetWidth/2,r=o.offsetTop+e.offsetHeight/2,c=s.offsetLeft+n.offsetWidth/2,a=s.offsetTop+n.offsetHeight/2,l=c-i,h=a-r,f=Math.sqrt(l*l+h*h),u=Math.max(50,Math.min(200,f*.3)),y=Math.abs(l),m=Math.abs(h);let p,g;if(f<150){const w=e.closest("me-main").className==="lhs"?-1:1;p={x:200*w,y:0},g={x:200*w,y:0}}else if(y>m*1.5){const w=l>0?e.offsetWidth/2:-e.offsetWidth/2,x=l>0?-n.offsetWidth/2:n.offsetWidth/2;p={x:w+(l>0?u:-u),y:0},g={x:x+(l>0?-u:u),y:0}}else if(m>y*1.5){const w=h>0?e.offsetHeight/2:-e.offsetHeight/2,x=h>0?-n.offsetHeight/2:n.offsetHeight/2;p={x:0,y:w+(h>0?u:-u)},g={x:0,y:x+(h>0?-u:u)}}else{const w=Math.atan2(h,l),x=e.offsetWidth/2*Math.cos(w),S=e.offsetHeight/2*Math.sin(w),T=-(n.offsetWidth/2)*Math.cos(w),L=-(n.offsetHeight/2)*Math.sin(w),C=u*.7*(l>0?1:-1),N=u*.7*(h>0?1:-1);p={x:x+C,y:S+N},g={x:T-C,y:L-N}}return{delta1:p,delta2:g}},ht=function(t,e,n,o,s){if(!e||!n)return;if(!o.delta1||!o.delta2){const M=Te(t,e,n);o.delta1=M.delta1,o.delta2=M.delta2}const i=tt(t,e,o.delta1),r=tt(t,n,o.delta2),{x:c,y:a}=G(i),{ctrlX:l,ctrlY:h}=i,{ctrlX:f,ctrlY:u}=r,{x:y,y:m}=G(r),p=K(f,u,y,m);if(!p)return;const g=`M ${p.x1} ${p.y1} L ${y} ${m} L ${p.x2} ${p.y2}`;let b="";if(o.bidirectional){const M=K(l,h,c,a);if(!M)return;b=`M ${M.x1} ${M.y1} L ${c} ${a} L ${M.x2} ${M.y2}`}const w=me(`M ${c} ${a} C ${l} ${h} ${f} ${u} ${y} ${m}`,g,b,o.style),{x,y:S}=At(c,a,l,h,f,u,y,m),T=o.style?.labelColor||"rgb(235, 95, 82)",L="arrow-"+o.id;w.id=L;const C=t.markdown?t.markdown(o.label,o):o.label,N=dt(C,x,S,{anchor:"middle",color:T,dataType:"arrow",svgId:L});w.labelEl=N,w.arrowObj=o,w.dataset.linkid=o.id,t.labelContainer.appendChild(N),t.linkSvgGroup.appendChild(w),Q(N),s||(t.arrows.push(o),t.currentArrow=w,$t(t,o,i,r))},Le=function(t,e,n={}){const o={id:z(),label:"Custom Link",from:t.nodeObj.id,to:e.nodeObj.id,...n};ht(this,t,e,o),this.bus.fire("operation",{name:"createArrow",obj:o})},De=function(t){et(this);const e={...t,id:z()};ht(this,this.findEle(e.from),this.findEle(e.to),e),this.bus.fire("operation",{name:"createArrow",obj:e})},Me=function(t){let e;if(t?e=t:e=this.currentArrow,!e)return;et(this);const n=e.arrowObj.id;this.arrows=this.arrows.filter(o=>o.id!==n),e.labelEl?.remove(),e.remove(),this.bus.fire("operation",{name:"removeArrow",obj:{id:n}})},ke=function(t){this.currentArrow=t;const e=t.arrowObj,n=this.findEle(e.from),o=this.findEle(e.to),s=tt(this,n,e.delta1),i=tt(this,o,e.delta2);$t(this,e,s,i)},Ne=function(){et(this),this.currentArrow=null},ft=function(t,e){const n=document.createElementNS(I,"path");return D(n,{d:t,stroke:e,fill:"none","stroke-width":"6","stroke-linecap":"round","stroke-linejoin":"round"}),n},Ae=function(t,e){const n=document.createElementNS(I,"g");n.setAttribute("class","arrow-highlight"),n.setAttribute("opacity","0.45");const o=ft(t.line.getAttribute("d"),e);n.appendChild(o);const s=ft(t.arrow1.getAttribute("d"),e);if(n.appendChild(s),t.arrow2.getAttribute("d")){const i=ft(t.arrow2.getAttribute("d"),e);n.appendChild(i)}t.insertBefore(n,t.firstChild)},Pe=function(t){const e=t.querySelector(".arrow-highlight");e&&e.remove()},$e=function(t){const e=t.querySelector(".arrow-highlight");if(!e)return;const n=e.querySelectorAll("path");n.length>=1&&n[0].setAttribute("d",t.line.getAttribute("d")),n.length>=2&&n[1].setAttribute("d",t.arrow1.getAttribute("d")),n.length>=3&&t.arrow2.getAttribute("d")&&n[2].setAttribute("d",t.arrow2.getAttribute("d"))},et=function(t){t.helper1?.destroy(),t.helper2?.destroy(),t.linkController.style.display="none",t.P2.style.display="none",t.P3.style.display="none",t.currentArrow&&Pe(t.currentArrow)},$t=function(t,e,n,o){const{linkController:s,P2:i,P3:r,line1:c,line2:a,nodes:l,map:h,currentArrow:f,bus:u}=t;if(!f)return;s.style.display="initial",i.style.display="initial",r.style.display="initial",l.appendChild(s),l.appendChild(i),l.appendChild(r),Ae(f,Ee);let{x:y,y:m}=G(n),{ctrlX:p,ctrlY:g}=n,{ctrlX:b,ctrlY:w}=o,{x,y:S}=G(o);i.style.cssText=`top:${g}px;left:${p}px;`,r.style.cssText=`top:${w}px;left:${b}px;`,Z(c,y,m,p,g),Z(a,b,w,x,S),t.helper1=Nt.create(i),t.helper2=Nt.create(r),t.helper1.init(h,(T,L)=>{p=p+T/t.scaleVal,g=g+L/t.scaleVal;const C=G({...n,ctrlX:p,ctrlY:g});y=C.x,m=C.y,i.style.top=g+"px",i.style.left=p+"px",Pt(f,y,m,p,g,b,w,x,S,e),Z(c,y,m,p,g),e.delta1.x=p-n.cx,e.delta1.y=g-n.cy,u.fire("updateArrowDelta",e)}),t.helper2.init(h,(T,L)=>{b=b+T/t.scaleVal,w=w+L/t.scaleVal;const C=G({...o,ctrlX:b,ctrlY:w});x=C.x,S=C.y,r.style.top=w+"px",r.style.left=b+"px",Pt(f,y,m,p,g,b,w,x,S,e),Z(a,b,w,x,S),e.delta2.x=b-o.cx,e.delta2.y=w-o.cy,u.fire("updateArrowDelta",e)})};function He(){this.linkSvgGroup.innerHTML="",this.labelContainer.querySelectorAll(\'.svg-label[data-type="arrow"]\').forEach(e=>e.remove());for(let e=0;e<this.arrows.length;e++){const n=this.arrows[e];try{ht(this,this.findEle(n.from),this.findEle(n.to),n,!0)}catch{}}this.nodes.appendChild(this.linkSvgGroup)}function Ie(t){et(this),t&&t.labelEl&&Mt(this,t.labelEl,t.arrowObj)}function Oe(){this.arrows=this.arrows.filter(t=>U(t.from,this.nodeData)&&U(t.to,this.nodeData))}const Ye=Object.freeze(Object.defineProperty({__proto__:null,createArrow:Le,createArrowFrom:De,editArrowLabel:Ie,removeArrow:Me,renderArrow:He,selectArrow:ke,tidyArrow:Oe,unselectArrow:Ne},Symbol.toStringTag,{value:"Module"})),Re=function(t){if(t.length===0)throw new Error("No selected node.");if(t.length===1){const a=t[0].nodeObj,l=t[0].nodeObj.parent;if(!l)throw new Error("Can not select root node.");const h=l.children.findIndex(f=>a===f);return{parent:l.id,start:h,end:h}}let e=0;const n=t.map(a=>{let l=a.nodeObj;const h=[];for(;l.parent;){const f=l.parent,y=f.children?.indexOf(l);l=f,h.unshift({node:l,index:y})}return h.length>e&&(e=h.length),h});let o=0;t:for(;o<e;o++){const a=n[0][o]?.node;for(let l=1;l<n.length;l++)if(n[l][o]?.node!==a)break t}if(!o)throw new Error("Can not select root node.");const s=n.map(a=>a[o-1].index).sort(),i=s[0]||0,r=s[s.length-1]||0,c=n[0][o-1].node;if(!c.parent)throw new Error("Please select nodes in the same main topic.");return{parent:c.id,start:i,end:r}},Be=function(t){const e=document.createElementNS(I,"g");return e.setAttribute("id",t),e},Ht=function(t,e){const n=document.createElementNS(I,"path");return D(n,{d:t,stroke:e||"#666",fill:"none","stroke-linecap":"round","stroke-width":"2"}),n},We=t=>t.parentElement.parentElement,Xe=function(t,{parent:e,start:n}){const o=t.findEle(e),s=o.nodeObj;let i;return s.parent?i=o.closest("me-main").className:i=t.findEle(s.children[n].id).closest("me-main").className,i},ut=function(t,e){const{id:n,label:o,parent:s,start:i,end:r,style:c}=e,{nodes:a,theme:l,summarySvg:h}=t,u=t.findEle(s).nodeObj,y=Xe(t,e);let m=1/0,p=0,g=0,b=0;for(let d=i;d<=r;d++){const v=u.children?.[d];if(!v)return t.removeSummary(n),null;const E=We(t.findEle(v.id)),{offsetLeft:$,offsetTop:W}=H(a,E),A=i===r?10:20;d===i&&(g=W+A),d===r&&(b=W+E.offsetHeight-A),$<m&&(m=$),E.offsetWidth+$>p&&(p=E.offsetWidth+$)}let w,x;const S=u.parent?10:0,T=g+S,L=b+S,C=(T+L)/2,N=c?.stroke||l.cssVar["--color"],M=c?.labelColor||l.cssVar["--color"],R="s-"+n,k=t.markdown?t.markdown(o,e):o;y===X.LHS?(w=Ht(`M ${m+10} ${T} c -5 0 -10 5 -10 10 L ${m} ${L-10} c 0 5 5 10 10 10 M ${m} ${C} h -10`,N),x=dt(k,m-20,C,{anchor:"end",color:M,dataType:"summary",svgId:R})):(w=Ht(`M ${p-10} ${T} c 5 0 10 5 10 10 L ${p} ${L-10} c 0 5 -5 10 -10 10 M ${p} ${C} h 10`,N),x=dt(k,p+20,C,{anchor:"start",color:M,dataType:"summary",svgId:R}));const V=Be(R);return V.appendChild(w),t.labelContainer.appendChild(x),Q(x),V.summaryObj=e,V.labelEl=x,h.appendChild(V),V},Ge=Object.freeze(Object.defineProperty({__proto__:null,createSummary:function(t={}){if(!this.currentNodes)return;const{currentNodes:e,summaries:n,bus:o}=this,{parent:s,start:i,end:r}=Re(e),c={id:z(),parent:s,start:i,end:r,label:"summary",style:t.style},a=ut(this,c);n.push(c),this.editSummary(a),o.fire("operation",{name:"createSummary",obj:c})},createSummaryFrom:function(t){const e=z(),n={...t,id:e};ut(this,n),this.summaries.push(n),this.bus.fire("operation",{name:"createSummary",obj:n})},editSummary:function(t){t&&t.labelEl&&Mt(this,t.labelEl,t.summaryObj)},removeSummary:function(t){const e=this.summaries.findIndex(n=>n.id===t);e>-1&&(this.summaries.splice(e,1),this.nodes.querySelector("#s-"+t)?.remove(),this.nodes.querySelector("#label-s-"+t)?.remove()),this.bus.fire("operation",{name:"removeSummary",obj:{id:t}})},renderSummary:function(){this.summarySvg.innerHTML="",this.summaries.forEach(t=>{try{ut(this,t)}catch{}}),this.nodes.insertAdjacentElement("beforeend",this.summarySvg)},selectSummary:function(t){const e=t.labelEl;e&&e.classList.add("selected"),this.currentSummary=t},unselectSummary:function(){this.currentSummary?.labelEl?.classList.remove("selected"),this.currentSummary=null}},Symbol.toStringTag,{value:"Module"})),P="http://www.w3.org/2000/svg";function Ve(t,e){const n=document.createElementNS(P,"svg");return D(n,{version:"1.1",xmlns:P,height:t,width:e}),n}function ze(t,e){return(parseInt(t)-parseInt(e))/2}function Fe(t,e,n,o){const s=document.createElementNS(P,"g");let i="";return t.text?i=t.text.textContent:i=t.childNodes[0].textContent,i.split(`\n`).forEach((c,a)=>{const l=document.createElementNS(P,"text");D(l,{x:n+parseInt(e.paddingLeft)+"",y:o+parseInt(e.paddingTop)+ze(e.lineHeight,e.fontSize)*(a+1)+parseFloat(e.fontSize)*(a+1)+"","text-anchor":"start","font-family":e.fontFamily,"font-size":`${e.fontSize}`,"font-weight":`${e.fontWeight}`,fill:`${e.color}`}),l.innerHTML=c,s.appendChild(l)}),s}function qe(t,e,n,o){let s="";t.nodeObj?.dangerouslySetInnerHTML?s=t.nodeObj.dangerouslySetInnerHTML:t.text?s=t.text.textContent:s=t.childNodes[0].textContent;const i=document.createElementNS(P,"foreignObject");D(i,{x:n+parseInt(e.paddingLeft)+"",y:o+parseInt(e.paddingTop)+"",width:e.width,height:e.height});const r=document.createElement("div");return D(r,{xmlns:"http://www.w3.org/1999/xhtml",style:`font-family: ${e.fontFamily}; font-size: ${e.fontSize}; font-weight: ${e.fontWeight}; color: ${e.color}; white-space: pre-wrap;`}),r.innerHTML=s,i.appendChild(r),i}function je(t,e){const n=getComputedStyle(e),{offsetLeft:o,offsetTop:s}=H(t.nodes,e),i=document.createElementNS(P,"rect");return D(i,{x:o+"",y:s+"",rx:n.borderRadius,ry:n.borderRadius,width:n.width,height:n.height,fill:n.backgroundColor,stroke:n.borderColor,"stroke-width":n.borderWidth}),i}function nt(t,e,n=!1){const o=getComputedStyle(e),{offsetLeft:s,offsetTop:i}=H(t.nodes,e),r=document.createElementNS(P,"rect");D(r,{x:s+"",y:i+"",rx:o.borderRadius,ry:o.borderRadius,width:o.width,height:o.height,fill:o.backgroundColor,stroke:o.borderColor,"stroke-width":o.borderWidth});const c=document.createElementNS(P,"g");c.appendChild(r);let a;return n?a=qe(e,o,s,i):a=Fe(e,o,s,i),c.appendChild(a),c}function _e(t,e){const n=getComputedStyle(e),{offsetLeft:o,offsetTop:s}=H(t.nodes,e),i=document.createElementNS(P,"a"),r=document.createElementNS(P,"text");return D(r,{x:o+"",y:s+parseInt(n.fontSize)+"","text-anchor":"start","font-family":n.fontFamily,"font-size":`${n.fontSize}`,"font-weight":`${n.fontWeight}`,fill:`${n.color}`}),r.innerHTML=e.textContent,i.appendChild(r),i.setAttribute("href",e.href),i}function Ue(t,e){const n=getComputedStyle(e),{offsetLeft:o,offsetTop:s}=H(t.nodes,e),i=document.createElementNS(P,"image");return D(i,{x:o+"",y:s+"",width:n.width+"",height:n.height+"",href:e.src}),i}const ot=100,Ke=\'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\',Je=(t,e=!1)=>{const n=t.nodes,o=n.offsetHeight+ot*2,s=n.offsetWidth+ot*2,i=Ve(o+"px",s+"px"),r=document.createElementNS(P,"svg"),c=document.createElementNS(P,"rect");D(c,{x:"0",y:"0",width:`${s}`,height:`${o}`,fill:t.theme.cssVar["--bgcolor"]}),i.appendChild(c),n.querySelectorAll(".subLines").forEach(f=>{const u=f.cloneNode(!0),{offsetLeft:y,offsetTop:m}=H(n,f.parentElement);u.setAttribute("x",`${y}`),u.setAttribute("y",`${m}`),r.appendChild(u)});const a=n.querySelector(".lines")?.cloneNode(!0);a&&r.appendChild(a);const l=n.querySelector(".topiclinks")?.cloneNode(!0);l&&r.appendChild(l);const h=n.querySelector(".summary")?.cloneNode(!0);return h&&r.appendChild(h),n.querySelectorAll("me-tpc").forEach(f=>{f.nodeObj.dangerouslySetInnerHTML?r.appendChild(nt(t,f,!e)):(r.appendChild(je(t,f)),r.appendChild(nt(t,f.text,!e)))}),n.querySelectorAll(".tags > span").forEach(f=>{r.appendChild(nt(t,f))}),n.querySelectorAll(".icons > span").forEach(f=>{r.appendChild(nt(t,f))}),n.querySelectorAll(".hyper-link").forEach(f=>{r.appendChild(_e(t,f))}),n.querySelectorAll("img").forEach(f=>{r.appendChild(Ue(t,f))}),D(r,{x:ot+"",y:ot+"",overflow:"visible"}),i.appendChild(r),i},Qe=(t,e)=>(e&&t.insertAdjacentHTML("afterbegin","<style>"+e+"</style>"),Ke+t.outerHTML);function Ze(t){return new Promise((e,n)=>{const o=new FileReader;o.onload=s=>{e(s.target.result)},o.onerror=s=>{n(s)},o.readAsDataURL(t)})}const tn={getObjById:U,generateNewObj:Ot,layout:Yt,linkDiv:ye,editTopic:zt,createWrapper:Wt,createParent:Xt,createChildren:Gt,createTopic:Vt,findEle:yt,changeTheme:Ce,...re,...{},...Ye,...Ge,...Object.freeze(Object.defineProperty({__proto__:null,exportPng:async function(t=!1,e){const n=this.exportSvg(t,e),o=await Ze(n);return new Promise((s,i)=>{const r=new Image;r.setAttribute("crossOrigin","anonymous"),r.onload=()=>{const c=document.createElement("canvas");c.width=r.width,c.height=r.height,c.getContext("2d").drawImage(r,0,0),c.toBlob(s,"image/png",1)},r.src=o,r.onerror=i})},exportSvg:function(t=!1,e){const n=Je(this,t),o=Qe(n,e);return new Blob([o],{type:"image/svg+xml"})}},Symbol.toStringTag,{value:"Module"})),init(t){if(t=JSON.parse(JSON.stringify(t)),!t||!t.nodeData)return new Error("MindElixir: `data` is required");t.direction!==void 0&&(this.direction=t.direction),this.changeTheme(t.theme||this.theme,!1),this.nodeData=t.nodeData,it(this.nodeData),this.arrows=t.arrows||[],this.summaries=t.summaries||[],this.tidyArrow(),this.toolBar&&xe(this),this.layout(),this.linkDiv(),this.toCenter()},destroy(){this.disposable.forEach(t=>t()),this.el&&(this.el.innerHTML=""),this.el=void 0,this.nodeData=void 0,this.arrows=void 0,this.summaries=void 0,this.currentArrow=void 0,this.currentNodes=void 0,this.currentSummary=void 0,this.theme=void 0,this.direction=void 0,this.bus=void 0,this.container=void 0,this.map=void 0,this.lines=void 0,this.linkController=void 0,this.linkSvgGroup=void 0,this.P2=void 0,this.P3=void 0,this.line1=void 0,this.line2=void 0,this.nodes=void 0,this.selection?.destroy(),this.selection=void 0}};function en({pT:t,pL:e,pW:n,pH:o,cT:s,cL:i,cW:r,cH:c,direction:a,containerHeight:l}){let h=e+n/2;const f=t+o/2;let u;a===X.LHS?u=i+r:u=i;const y=s+c/2,p=(1-Math.abs(y-f)/l)*.25*(n/2);return a===X.LHS?h=h-n/10-p:h=h+n/10+p,`M ${h} ${f} Q ${h} ${y} ${u} ${y}`}function nn({pT:t,pL:e,pW:n,pH:o,cT:s,cL:i,cW:r,cH:c,direction:a,isFirst:l}){const h=parseInt(this.container.style.getPropertyValue("--node-gap-x"));let f=0,u=0;l?f=t+o/2:f=t+o;const y=s+c;let m=0,p=0,g=0;const b=Math.abs(f-y)/300*h;return a===X.LHS?(g=e,m=g+h,p=g-h,u=i+h,`M ${m} ${f} C ${g} ${f} ${g+b} ${y} ${p} ${y} H ${u}`):(g=e+n,m=g-h,p=g+h,u=i+r-h,`M ${m} ${f} C ${g} ${f} ${g-b} ${y} ${p} ${y} H ${u}`)}const on="5.10.0";function sn(t){return{x:0,y:0,moved:!1,mousedown:!1,onMove(e,n){this.mousedown&&(this.moved=!0,t.move(e,n))},clear(){this.mousedown=!1}}}function O({el:t,direction:e,editable:n,contextMenu:o,toolBar:s,keypress:i,mouseSelectionButton:r,selectionContainer:c,before:a,newTopicName:l,allowUndo:h,generateMainBranch:f,generateSubBranch:u,overflowHidden:y,theme:m,alignment:p,scaleSensitivity:g,scaleMax:b,scaleMin:w,handleWheel:x,markdown:S,imageProxy:T,pasteHandler:L}){let C=null;const N=Object.prototype.toString.call(t);if(N==="[object HTMLDivElement]"?C=t:N==="[object String]"&&(C=document.querySelector(t)),!C)throw new Error("MindElixir: el is not a valid element");C.style.position="relative",C.innerHTML="",this.el=C,this.disposable=[],this.before=a||{},this.newTopicName=l||"New Node",this.contextMenu=o??!0,this.toolBar=s??!0,this.keypress=i??!0,this.mouseSelectionButton=r??0,this.direction=e??1,this.editable=n??!0,this.allowUndo=h??!0,this.scaleSensitivity=g??.1,this.scaleMax=b??1.4,this.scaleMin=w??.2,this.generateMainBranch=f||en,this.generateSubBranch=u||nn,this.overflowHidden=y??!1,this.alignment=p??"root",this.handleWheel=x??!0,this.markdown=S||void 0,this.imageProxy=T||void 0,this.currentNodes=[],this.currentArrow=null,this.scaleVal=1,this.tempDirection=null,this.dragMoveHelper=sn(this),this.bus=ge(),this.container=document.createElement("div"),this.selectionContainer=c||this.container,this.container.className="map-container";const M=window.matchMedia("(prefers-color-scheme: dark)");this.theme=m||(M.matches?_:j);const R=document.createElement("div");R.className="map-canvas",this.map=R,this.container.setAttribute("tabindex","0"),this.container.appendChild(this.map),this.el.appendChild(this.container),this.nodes=document.createElement("me-nodes"),this.lines=F("lines"),this.summarySvg=F("summary"),this.linkController=F("linkcontroller"),this.P2=document.createElement("div"),this.P3=document.createElement("div"),this.P2.className=this.P3.className="circle",this.P2.style.display=this.P3.style.display="none",this.line1=Dt(),this.line2=Dt(),this.linkController.appendChild(this.line1),this.linkController.appendChild(this.line2),this.linkSvgGroup=F("topiclinks"),this.labelContainer=document.createElement("div"),this.labelContainer.className="label-container",this.map.appendChild(this.nodes),this.overflowHidden?this.container.style.overflow="hidden":this.disposable.push(pe(this)),L&&(this.pasteHandler=L)}return O.prototype=tn,Object.defineProperty(O.prototype,"currentNode",{get(){return this.currentNodes[this.currentNodes.length-1]},enumerable:!0}),O.LEFT=0,O.RIGHT=1,O.SIDE=2,O.THEME=j,O.DARK_THEME=_,O.version=on,O.E=yt,Y.DARK_THEME=_,Y.LEFT=0,Y.RIGHT=1,Y.SIDE=2,Y.THEME=j,Y.default=O,Object.defineProperties(Y,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),Y})({});\n',T=`.map-container{-webkit-tap-highlight-color:rgba(0,0,0,0);font-family:-apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;user-select:none;-webkit-user-select:none;height:100%;width:100%;overflow:hidden;font-size:16px;outline:none;touch-action:none;background-color:var(--bgcolor)}.map-container p{margin:0}.map-container *{box-sizing:border-box}.map-container::-webkit-scrollbar{width:0px;height:0px}.map-container .selected{outline:2px solid var(--selected);outline-offset:1px}.map-container.space-pressed,.map-container.space-pressed *{cursor:grab!important}.map-container.space-pressed:active,.map-container.space-pressed:active *{cursor:grabbing!important}.map-container .hyper-link{text-decoration:none;margin-left:.3em}.map-container me-main>me-wrapper>me-parent>me-epd{top:50%;transform:translateY(-50%)}.map-container me-epd{top:100%;transform:translateY(-50%)}.map-container .lhs{direction:rtl}.map-container .lhs>me-wrapper>me-parent>me-epd{left:-10px}.map-container .lhs me-epd{left:5px}.map-container .lhs me-tpc{direction:ltr}.map-container .rhs>me-wrapper>me-parent>me-epd{right:-10px}.map-container .rhs me-epd{right:5px}.map-container .map-canvas{position:relative;-webkit-user-select:none;user-select:none;width:fit-content;transform:scale(1)}.map-container .map-canvas me-nodes{position:relative;display:flex;justify-content:center;align-items:center;height:max-content;width:max-content;padding:var(--map-padding)}.map-container me-main>me-wrapper{position:relative;margin:var(--main-gap-y) var(--main-gap-x)}.map-container me-main>me-wrapper>me-parent{margin:10px;padding:0}.map-container me-main>me-wrapper>me-parent>me-tpc{border-radius:var(--main-radius);background-color:var(--main-bgcolor);border:2px solid var(--main-color);color:var(--main-color);padding:8px 25px}.map-container me-wrapper{display:block;pointer-events:none;width:fit-content}.map-container me-children,.map-container me-parent{display:inline-block;vertical-align:middle}.map-container me-root{position:relative;margin:45px 0;z-index:10}.map-container me-root me-tpc{font-size:25px;color:var(--root-color);padding:10px 30px;border-radius:var(--root-radius);border:var(--root-border-color) 2px solid;background-color:var(--root-bgcolor)}.map-container me-parent{position:relative;cursor:pointer;padding:6px var(--node-gap-x);margin-top:var(--node-gap-y);z-index:10}.map-container me-parent me-tpc{position:relative;border-radius:3px;color:var(--color);padding:var(--topic-padding)}.map-container me-parent me-tpc .insert-preview{position:absolute;width:100%;left:0;z-index:9}.map-container me-parent me-tpc .show{background:#7ad5ff;pointer-events:none;opacity:.7;border-radius:3px}.map-container me-parent me-tpc .before{height:14px;top:-14px}.map-container me-parent me-tpc .in{height:100%;top:0}.map-container me-parent me-tpc .after{height:14px;bottom:-14px}.map-container me-parent me-epd{position:absolute;height:18px;width:18px;opacity:.8;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdD0iMTY1NjY1NDcxNzI0MiIgY2xhc3M9Imljb24iIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIKICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgICA8cGF0aCBkPSJNNTEyIDc0LjY2NjY2N0MyNzAuOTMzMzMzIDc0LjY2NjY2NyA3NC42NjY2NjcgMjcwLjkzMzMzMyA3NC42NjY2NjcgNTEyUzI3MC45MzMzMzMgOTQ5LjMzMzMzMyA1MTIgOTQ5LjMzMzMzMyA5NDkuMzMzMzMzIDc1My4wNjY2NjcgOTQ5LjMzMzMzMyA1MTIgNzUzLjA2NjY2NyA3NC42NjY2NjcgNTEyIDc0LjY2NjY2N3oiIHN0cm9rZS13aWR0aD0iNTQiIHN0cm9rZT0nYmxhY2snIGZpbGw9J3doaXRlJyA+PC9wYXRoPgogICAgPHBhdGggZD0iTTY4Mi42NjY2NjcgNDgwaC0xMzguNjY2NjY3VjM0MS4zMzMzMzNjMC0xNy4wNjY2NjctMTQuOTMzMzMzLTMyLTMyLTMycy0zMiAxNC45MzMzMzMtMzIgMzJ2MTM4LjY2NjY2N0gzNDEuMzMzMzMzYy0xNy4wNjY2NjcgMC0zMiAxNC45MzMzMzMtMzIgMzJzMTQuOTMzMzMzIDMyIDMyIDMyaDEzOC42NjY2NjdWNjgyLjY2NjY2N2MwIDE3LjA2NjY2NyAxNC45MzMzMzMgMzIgMzIgMzJzMzItMTQuOTMzMzMzIDMyLTMydi0xMzguNjY2NjY3SDY4Mi42NjY2NjdjMTcuMDY2NjY3IDAgMzItMTQuOTMzMzMzIDMyLTMycy0xNC45MzMzMzMtMzItMzItMzJ6Ij48L3BhdGg+Cjwvc3ZnPg==);background-repeat:no-repeat;background-size:contain;background-position:center;pointer-events:all;z-index:9}.map-container me-parent me-epd.minus{background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdD0iMTY1NjY1NTU2NDk4NSIgY2xhc3M9Imljb24iIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHZlcnNpb249IjEuMSIKICAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgICA8cGF0aCBkPSJNNTEyIDc0LjY2NjY2N0MyNzAuOTMzMzMzIDc0LjY2NjY2NyA3NC42NjY2NjcgMjcwLjkzMzMzMyA3NC42NjY2NjcgNTEyUzI3MC45MzMzMzMgOTQ5LjMzMzMzMyA1MTIgOTQ5LjMzMzMzMyA5NDkuMzMzMzMzIDc1My4wNjY2NjcgOTQ5LjMzMzMzMyA1MTIgNzUzLjA2NjY2NyA3NC42NjY2NjcgNTEyIDc0LjY2NjY2N3oiIHN0cm9rZS13aWR0aD0iNTQiIHN0cm9rZT0nYmxhY2snIGZpbGw9J3doaXRlJyA+PC9wYXRoPgogICAgPHBhdGggZD0iTTY4Mi42NjY2NjcgNTQ0SDM0MS4zMzMzMzNjLTE3LjA2NjY2NyAwLTMyLTE0LjkzMzMzMy0zMi0zMnMxNC45MzMzMzMtMzIgMzItMzJoMzQxLjMzMzMzNGMxNy4wNjY2NjcgMCAzMiAxNC45MzMzMzMgMzIgMzJzLTE0LjkzMzMzMyAzMi0zMiAzMnoiPjwvcGF0aD4KPC9zdmc+)!important;transition:opacity .3s;opacity:0}@media (hover: hover){.map-container me-parent me-epd.minus:hover{opacity:.8}}@media (hover: none){.map-container me-parent me-epd.minus{opacity:.8}}.map-container .icon{width:1em;height:1em;vertical-align:-.15em;fill:currentColor;overflow:hidden}.map-container .lines,.map-container .summary,.map-container .subLines,.map-container .topiclinks,.map-container .linkcontroller{position:absolute;height:102%;width:100%;top:0;left:0}.map-container .topiclinks,.map-container .linkcontroller,.map-container .summary{pointer-events:none;z-index:20}.map-container .summary>g,.map-container .topiclinks>g{cursor:pointer;pointer-events:stroke;z-index:20}.map-container .label-container{z-index:21}.map-container .lines,.map-container .subLines{pointer-events:none}.map-container #input-box{position:absolute;top:0;left:0;width:max-content;max-width:35em;direction:ltr;-webkit-user-select:auto;user-select:auto;pointer-events:auto;color:var(--color);background-color:var(--bgcolor);outline:1px solid #ccc;border-radius:2px;z-index:100}.map-container me-tpc{display:block;max-width:35em;white-space:pre-wrap;pointer-events:all}.map-container me-tpc>*{pointer-events:none}.map-container me-tpc>a,.map-container me-tpc>iframe{pointer-events:auto}.map-container me-tpc>.text{display:inline-block}.map-container me-tpc>.text a{pointer-events:auto}.map-container me-tpc>img{display:block;margin-bottom:8px;object-fit:cover}.map-container .circle{position:absolute;height:10px;width:10px;margin-top:-5px;margin-left:-5px;border-radius:100%;background:#757575;border:2px solid #ffffff;z-index:50;cursor:pointer}.map-container .circle:before{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:30px;height:30px;background:transparent}.map-container .tags{direction:ltr}.map-container .tags span{display:inline-block;border-radius:3px;padding:2px 4px;background:#d6f0f8;color:#276f86;margin:2px 4px 0 0;font-size:12px;line-height:1.3em}.map-container .icons{display:inline-block;direction:ltr;margin-left:5px}.map-container .icons span{display:inline-block;line-height:1.3em}.map-container .mind-elixir-ghost{position:absolute;top:0;left:0;box-sizing:content-box;opacity:.7;background-color:var(--main-bgcolor);border:2px solid var(--main-color);color:var(--main-color);max-width:200px;width:fit-content;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:8px 16px;border-radius:6px;display:none;pointer-events:none;z-index:1000}.map-container .selection-area{background:#4f90f22d;border:1px solid #4f90f2}.map-container .svg-label{position:absolute;overflow-wrap:break-word;-webkit-hyphens:auto;hyphens:auto;line-height:1.2;pointer-events:auto;cursor:pointer;z-index:10;width:max-content;max-width:200px;border-radius:3px;padding:var(--topic-padding)}.map-container .svg-label[data-type=arrow]{background-color:var(--main-bgcolor-transparent)}.map-container h1{font-size:1.5rem;font-weight:700;color:var(--selected)}.map-container h2{font-size:1.25rem;font-weight:600;color:var(--selected)}.map-container h3{font-size:1.125rem;font-weight:600;color:var(--selected)}.map-container h4{font-size:1rem;font-weight:600;color:var(--selected)}.map-container h5{font-size:.875rem;font-weight:600;color:var(--selected)}.map-container h6{font-size:.875rem;font-weight:500;margin:.1rem 0;color:var(--selected);font-style:italic}.map-container strong.asterisk-emphasis,.map-container em{color:var(--selected)}.map-container strong.underscore-emphasis{background:#ffeb3b40;padding:.05em .15em;border-radius:.15em}.map-container a{color:var(--selected)}.map-container a:hover{color:var(--selected);text-decoration:underline}.map-container .context-menu{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99}.map-container .context-menu .menu-list{position:fixed;list-style:none;margin:0;padding:0;color:var(--panel-color);box-shadow:0 12px 15px #0003;border-radius:5px;overflow:hidden}.map-container .context-menu .menu-list li{min-width:200px;overflow:hidden;white-space:nowrap;padding:6px 10px;background:var(--panel-bgcolor);border-bottom:1px solid var(--panel-border-color);cursor:pointer}.map-container .context-menu .menu-list li span{line-height:20px}.map-container .context-menu .menu-list li a{color:#333;text-decoration:none}.map-container .context-menu .menu-list li.disabled{display:none}.map-container .context-menu .menu-list li:hover{filter:brightness(.95)}.map-container .context-menu .menu-list li:last-child{border-bottom:0}.map-container .context-menu .menu-list li span:last-child{float:right}.map-container .context-menu .key{font-size:10px;background-color:#f1f1f1;color:#333;padding:2px 5px;border-radius:3px}.map-container .tips{position:absolute;bottom:28px;left:50%;transform:translate(-50%);color:var(--panel-color);background:var(--panel-bgcolor);opacity:.8;padding:5px 10px;border-radius:5px;font-weight:700}.mind-elixir-toolbar{position:absolute;color:var(--panel-color);background:var(--panel-bgcolor);padding:10px;border-radius:5px;box-shadow:0 1px 2px #0003}.mind-elixir-toolbar svg{display:inline-block}.mind-elixir-toolbar span:active{opacity:.5}.mind-elixir-toolbar.rb{right:20px;bottom:20px}.mind-elixir-toolbar.rb span+span{margin-left:10px}.mind-elixir-toolbar.lt{font-size:20px;left:20px;top:20px}.mind-elixir-toolbar.lt span{display:block}.mind-elixir-toolbar.lt span+span{margin-top:10px}
`,Y=(A,e,t)=>{const{customCss:n="",...o}=t||{},r={...{el:"#mind-elixir",editable:!1,draggable:!1,contextMenu:!1,mouseSelectionButton:2},...o};return`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MindElixir</title>
        <style>html, body {margin: 0;padding: 0;}#mind-elixir{width:100vw;height:100vh;}</style>
        <style>${T}</style>
        ${n?`<style>${n}</style>`:""}
    </head>
    <body>
        <script>${A}<\/script>
        <div id="mind-elixir"></div>
        <script>
            const data = ${e}
            const mindElixir = new MindElixirLite(${JSON.stringify(r)})
            mindElixir.init(data)
            <\/script>
    </body>
    </html>`};function H(A,e){const t=JSON.stringify(A);return Y(h,t,e)}const y=(A,e)=>{let t="";const n=(o,i=0)=>{e&&o.id===e.id?t+="  ".repeat(i)+`- **${o.topic} (You Should Insert Sub-Node Here)**
`:t+="  ".repeat(i)+`- ${o.topic}
`,o.children&&o.children.length>0&&o.children.forEach(r=>n(r,i+1))};return n(A),t},G=["box-sizing","display","position","top","right","bottom","left","width","height","min-width","min-height","max-width","max-height","flex","flex-basis","flex-direction","flex-grow","flex-shrink","flex-wrap","align-content","align-items","align-self","justify-content","justify-items","justify-self","order","float","clear","margin","margin-top","margin-right","margin-bottom","margin-left","padding","padding-top","padding-right","padding-bottom","padding-left","border","border-top","border-right","border-bottom","border-left","border-width","border-top-width","border-right-width","border-bottom-width","border-left-width","border-style","border-top-style","border-right-style","border-bottom-style","border-left-style","border-color","border-top-color","border-right-color","border-bottom-color","border-left-color","border-radius","border-top-left-radius","border-top-right-radius","border-bottom-left-radius","border-bottom-right-radius","background","background-color","background-image","background-repeat","background-size","background-position","color","font","font-family","font-size","font-weight","font-style","line-height","text-align","text-decoration","text-transform","text-shadow","text-overflow","white-space","word-break","word-wrap","vertical-align","opacity","visibility","transform","transform-origin","box-shadow","outline","z-index","overflow","overflow-x","overflow-y","fill","stroke","stroke-width","direction","unicode-bidi","writing-mode"];async function O(A){try{const t=await(await fetch(A)).blob();return await M(t)}catch{return A}}function M(A){return new Promise((e,t)=>{const n=new FileReader;n.onload=()=>e(n.result),n.onerror=t,n.readAsDataURL(A)})}function z(A,e,t){if(!(A instanceof HTMLElement||A instanceof SVGElement)||!(e instanceof HTMLElement||e instanceof SVGElement))return;const n=window.getComputedStyle(A),o=e.style;for(const i of G){if(t.has(i))continue;const r=n.getPropertyValue(i);r&&o.setProperty(i,r,n.getPropertyPriority(i))}}function x(A,e,t,n){z(A,e,t);const o=Array.from(A.children),i=Array.from(e.children);for(let r=0;r<o.length;r++){const a=o[r],g=i[r];if(n&&!n(a)){g.remove();continue}g&&x(a,g,t,n)}}async function U(A){const e=Array.from(A.querySelectorAll("img"));await Promise.all(e.map(async t=>{const n=t.getAttribute("src");if(n&&!n.startsWith("data:"))try{t.setAttribute("src",await O(n))}catch{}}))}function K(A){const e=new XMLSerializer().serializeToString(A);return"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e)}function J(A){return A.complete&&A.naturalWidth>0?Promise.resolve():new Promise(e=>{const t=()=>{A.removeEventListener("load",t),A.removeEventListener("error",t),e()};A.addEventListener("load",t),A.addEventListener("error",t)})}async function j(A,e,t,n,o){var d,w;const i=A.cloneNode(!0),r=new Set(o.skipProperties??[]);x(A,i,r,o.filter);const a=Array.from(i.querySelectorAll("me-tpc"));i.tagName==="ME-TPC"&&a.push(i),a.forEach(B=>{const C=B.style,D=C.getPropertyValue("width"),Z=C.getPropertyValue("max-width");D&&D.endsWith("px")&&D!==Z&&(C.setProperty("text-wrap","nowrap"),Array.from(B.children).forEach(F=>{F instanceof HTMLElement&&F.style.setProperty("text-wrap","nowrap")}))}),i.style.position="relative",i.style.top="0",i.style.left="0",i.style.transform="none",(d=o.onClone)==null||d.call(o,i),i.style.overflow="visible";const g=document.createElement("div");g.setAttribute("xmlns","http://www.w3.org/1999/xhtml"),g.style.cssText=[`width:${e}px`,`height:${t}px`,"overflow:visible","position:relative",`transform:scale(${n})`,"transform-origin:0 0",...o.backgroundColor?[`background:${o.backgroundColor}`]:[]].join(";"),g.appendChild(i),(w=o.onHost)==null||w.call(o,g),await U(g);const f="http://www.w3.org/2000/svg",l=document.createElementNS(f,"svg");l.setAttribute("xmlns",f),l.setAttribute("width",String(Math.round(e*n))),l.setAttribute("height",String(Math.round(t*n)));const c=document.createElementNS(f,"foreignObject");return c.setAttribute("x","0"),c.setAttribute("y","0"),c.setAttribute("width",String(Math.round(e*n))),c.setAttribute("height",String(Math.round(t*n))),c.appendChild(g),l.appendChild(c),K(l)}async function p(A,e="png",t={}){const n=t.width??A.offsetWidth,o=t.height??A.offsetHeight,i=t.scale??window.devicePixelRatio??1,r=t.quality??(e==="png"?1:.85),a=await j(A,n,o,i,t),g=document.createElement("canvas");g.width=Math.round(n*i),g.height=Math.round(o*i);const f=g.getContext("2d");t.backgroundColor&&(f.fillStyle=t.backgroundColor,f.fillRect(0,0,g.width,g.height));const l=new Image;return l.src=a,await J(l),f.drawImage(l,0,0),await new Promise(c=>setTimeout(c,100)),f.drawImage(l,0,0),new Promise((c,d)=>{g.toBlob(w=>{w?c(w):d(new Error("canvas.toBlob returned null"))},`image/${e}`,r)})}async function S(A,e="png",t={}){const n=await p(A,e,t);return M(n)}async function R(A,e="png",t={}){const n=await p(A,e,t);return URL.createObjectURL(n)}const X="data:image/png;base64,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",Q=async(A,e)=>{const t=document.createElement("a");t.download=e,t.href=A,t.click()},E=A=>{setTimeout(()=>URL.revokeObjectURL(A),0)},V=(A,e)=>{let t=0,n=0;for(;e&&e!==A;)t+=e.offsetLeft,n+=e.offsetTop,e=e.offsetParent;return{offsetLeft:t,offsetTop:n}},b=async(A,e,t)=>{const{watermarkEnabled:n=!0,...o}=t||{},i=A.nodes.querySelectorAll(".svg-label");let r=0,a=0;i.forEach(c=>{const d=c,{offsetLeft:w}=V(A.nodes,d),B=-w,C=w+d.offsetWidth-A.nodes.offsetWidth;B>r&&(r=B),C>a&&(a=C)}),console.log("marginL",r,"marginR",a);let g=A.nodes.offsetWidth;r>0&&(g+=r+10),a>0&&(g+=a+10);const f=A.nodes.offsetHeight;return await p(A.nodes,e,{height:f,width:g,onClone:c=>{r>0&&(c.style.marginLeft=`${r+10}px`)},onHost:c=>{if(n){const w=A.theme.type==="dark"?"#f6f6f6":"#1a1a1a",B=document.createElement("div");B.style.cssText=`
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 16px;
          color: ${w};
          font-family: system-ui, -apple-system, sans-serif;
          font-weight: 500;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 9999999;
          pointer-events: none;
        `;const C=document.createElement("img");C.src=X,C.style.cssText=`
          width: 22px;
          height: 22px;
        `;const D=document.createElement("span");D.textContent="MIND ELIXIR",B.appendChild(C),B.appendChild(D),c.appendChild(B)}},backgroundColor:A.theme.cssVar["--bgcolor"]??(A.theme.type==="dark"?"#252526":"#f6f6f6"),quality:e==="png"?1:.7,...o})},P=async(A,e,t)=>{const n=await b(A,e,t);return URL.createObjectURL(n)},v=async(A,e)=>{const t=await P(A,e);Q(t,A.nodeData.topic+"."+e),E(t)},I=(A,e)=>{const t=A.getData(),n=H(t,e),o=new Blob([n],{type:"text/html"});return URL.createObjectURL(o)},k=(A,e)=>{const t=I(A,e);Q(t,A.nodeData.topic+".html"),E(t)},u=A=>{const e=A.getData(),t=new Blob([JSON.stringify(e)],{type:"application/json"});return URL.createObjectURL(t)},L=A=>{const e=u(A);Q(e,A.nodeData.topic+".json"),E(e)},m=A=>{const e=A.getData(),t=y(e.nodeData),n=new Blob([t],{type:"text/markdown"});return URL.createObjectURL(n)},N=A=>{const e=m(A);Q(e,A.nodeData.topic+".md"),E(e)},W=[{type:"HTML",export(A,e){return I(A,e)}},{type:"JSON",export:u},{type:"PNG",export(A,e){return P(A,"png",e)}},{type:"JPEG",export(A,e){return P(A,"jpeg",e)}},{type:"WEBP",export(A,e){return P(A,"webp",e)}},{type:"Markdown",export:m}],q=[{type:"HTML",download(A,e){return k(A,e)}},{type:"JSON",download:L},{type:"PNG",download(A){v(A,"png")}},{type:"JPEG",download(A){v(A,"jpeg")}},{type:"WEBP",download(A){v(A,"webp")}},{type:"Markdown",download:N}];s.convertToHtml=H,s.convertToMd=y,s.domToBlob=p,s.domToDataURL=S,s.domToObjectURL=R,s.downloadHtml=k,s.downloadImage=v,s.downloadJson=L,s.downloadMarkdown=N,s.downloadMethodList=q,s.downloadUrl=Q,s.exportHtml=I,s.exportImage=P,s.exportImageBlob=b,s.exportJson=u,s.exportMarkdown=m,s.exportMethodList=W,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})});

  return module.exports;
})();
var MINDMAP_OPEN_DESKTOP_PLUGIN = (function () {
  var module = { exports: {} };
  var exports = module.exports;
(function(t,o){typeof exports=="object"&&typeof module<"u"?o(exports):typeof define=="function"&&define.amd?define(["exports"],o):(t=typeof globalThis<"u"?globalThis:t||self,o(t.OpenDesktop={}))})(this,function(t){"use strict";const o="https://desktop.mind-elixir.com/",d="mind-elixir://open",E="http://127.0.0.1:6595/create-mindmap",l="http://127.0.0.1:6595/ping",T=n=>{const e=document.createElement("a");e.href=n,e.style.display="none",document.body.appendChild(e),e.click(),e.remove()},f=()=>{window.open(o,"_blank")||(window.location.href=o)},h=n=>new Promise(e=>setTimeout(e,n)),u=async n=>{try{return(await fetch(n)).ok}catch{return!1}},w=(n,e=1e4)=>new Promise((r,s)=>{const c=Date.now(),i=async()=>{try{if((await fetch(n)).ok){r();return}}catch{}if(Date.now()-c>e){s(new Error("服务启动超时"));return}setTimeout(i,100)};i()}),p=async(n,e,r={})=>{const{appUrl:s=d,serviceUrl:c=E,pingUrl:i=l,timeout:a=8e3,settleDelay:L=1e3}=r,U=await u(i);if(T(s),!U){try{await w(i,a)}catch{throw f(),new Error("未安装 Mind Elixir Desktop")}await h(L)}if(!(await fetch(c,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mindmap:JSON.stringify(n),source:e||window.location.href})})).ok)throw new Error("发送思维导图数据失败");console.log("思维导图已成功发送到 Mind Elixir")},m=p;t.launchAndCreateMindmap=m,t.launchMindElixir=p,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})});

  return module.exports;
})();


// Plugin logo as a data URI (see header comment).
var MINDMAP_ICON_URI = "data:image/png;base64,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";

/**
 * dsh-mindmap-live client factory.
 *
 * Plain CommonJS body (no JSX/TSX — we write React.createElement directly so
 * the bundle needs no compile chain). The build script wraps this body plus
 * the inlined MindElixir core into `window.__ModuleLoader__.load({ id, factory })`.
 *
 * Entry surface:
 *  - `sidebar.footer.action` (root, list): a button toggling the map view.
 *  - `shell.overlay` (root, list): hosts BOTH views —
 *      · dock  : a persistent right-hand panel so the user can watch and edit
 *                the map WHILE chatting (the chat column shifts left);
 *      · full  : the fullscreen overlay for focused work.
 *    Exactly one view renders at a time, so there is always a single canvas.
 *    It also renders a headless session-scope watcher (`MindMapAutoOpen`)
 *    that stays mounted while the panel is hidden.
 *  - Both view headers carry `MapActions`: download the live map as a PNG
 *    (@mind-elixir/export-mindmap) and open it in the Mind Elixir Desktop app
 *    (@mind-elixir/open-desktop).
 *
 * The views own a session-scope child slot that reads the host-computed
 * `mindmap` projection (`useProjection("mindmap")`). User edits on the canvas
 * are pushed back over the `/mindmap` Connection RPC channel, which appends a
 * `mindmap/update` event to the session log — the projection then broadcasts
 * the new tree to every client, keeping user and agent in real-time sync.
 *
 * Auto-open: when the agent creates a mind map for the current session while
 * the panel is hidden, the docked panel pops open once. The trigger is the
 * projection's absent→present edge observed by the headless watcher AFTER the
 * session history window is open (the projection seeds during open, so a page
 * reload or session switch replays an existing map as the baseline and never
 * auto-opens; only a genuinely new `mindmap/update` — which only `mindmap_set`,
 * i.e. the agent, can produce for an empty map — fires it).
 */

const { defineStore } = require("@deepseek-ai/dsh-client-runtime/client");
const React = require("react");

const OVERLAY_ID = "dsh-mindmap-live";
const SESSION_SLOT = "dsh-mindmap-live.session";
const AUTO_OPEN_SLOT = "dsh-mindmap-live.autoopen";
const PROJECTION_KEY = "mindmap";
const RPC_CHANNEL = "/mindmap";
const RPC_ENDPOINT = "update";

/* global MINDMAP_ICON_URI, MINDMAP_EXPORT_PLUGIN, MINDMAP_OPEN_DESKTOP_PLUGIN */
/**
 * Plugin logo, injected by build.mjs (inlined base64 data URI of
 * assets/icon.png) ahead of this body inside the same factory scope.
 *
 * Official @mind-elixir plugins, also inlined by build.mjs:
 *  - MINDMAP_EXPORT_PLUGIN      (@mind-elixir/export-mindmap) — downloadImage
 *    renders the live map via its built-in SCST engine (SVG foreignObject +
 *    canvas) and triggers a browser download.
 *  - MINDMAP_OPEN_DESKTOP_PLUGIN (@mind-elixir/open-desktop)  — launchMindElixir
 *    wakes the Mind Elixir Desktop app (mind-elixir:// protocol), waits for
 *    its local service and POSTs the tree; opens the download page when the
 *    app is not installed.
 */

/** Docked panel width: free-drag via the edge divider, clamped to these bounds. */
const DEFAULT_WIDTH = 520;
const MIN_DOCK_WIDTH = 300;

/** Hard cap so the map panel can never swallow the whole viewport. */
function maxDockWidth() {
  const vw = typeof window !== "undefined" && window.innerWidth ? window.innerWidth : 1920;
  return Math.max(MIN_DOCK_WIDTH, Math.round(vw * 0.8));
}

function clampWidth(w) {
  if (typeof w !== "number" || !Number.isFinite(w)) return DEFAULT_WIDTH;
  return Math.min(maxDockWidth(), Math.max(MIN_DOCK_WIDTH, Math.round(w)));
}

function createUiStore() {
  return defineStore({
    // v2: replaced the legacy boolean with an explicit view mode.
    init: () => ({ view: "hidden", width: DEFAULT_WIDTH }),
    persist: "dsh.mindmap-live.ui.v2",
    actions: {
      showDock: (d) => { d.view = "dock"; },
      showFull: (d) => { d.view = "full"; },
      hide: (d) => { d.view = "hidden"; },
      toggleDock: (d) => { d.view = d.view === "hidden" ? "dock" : "hidden"; },
      setWidth: (d, w) => { if (typeof w === "number") d.width = w; }
    }
  });
}

// ---------------------------------------------------------------------------
// MindElixir data helpers
// ---------------------------------------------------------------------------

/** A minimal default tree so the canvas always has a root to render. */
function defaultTree() {
  return {
    nodeData: {
      id: "root",
      topic: "思维导图",
      expanded: true,
      children: []
    },
    arrows: [],
    summaries: [],
    direction: 2,
    theme: undefined,
    compact: false,
    meta: undefined
  };
}

/** Deep-copy a tree so MindElixir never mutates the projection value. */
function cloneTree(tree) {
  if (tree === void 0 || tree === null) return defaultTree();
  try {
    return JSON.parse(JSON.stringify(tree));
  } catch (e) {
    return defaultTree();
  }
}

/**
 * Coerce a projection value into a renderable MindElixirData object.
 * Older writes may have stored the tree as a JSON string (models stringify
 * payloads); parse and validate here so bad history self-heals on display.
 * @param {*} raw - projection value.
 * @returns {object|null} usable tree, or null when nothing valid exists.
 */
function normalizeIncomingTree(raw) {
  if (raw === void 0 || raw === null) return null;
  let value = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  if (value.nodeData === null || typeof value.nodeData !== "object" || Array.isArray(value.nodeData)) return null;
  if (typeof value.nodeData.topic !== "string" || value.nodeData.topic.length === 0) {
    value = { ...value, nodeData: { ...value.nodeData, topic: "（未命名）" } };
  }
  return value;
}

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

/**
 * Registry of the live MindElixir instance. Exactly one canvas exists at any
 * time (dock and fullscreen never render together), so a single slot is
 * enough: MindElixirCanvas publishes on mount, clears on unmount, and the
 * header action buttons read the instance at click time.
 */
const activeCanvas = { mind: null };

/** Small icon button used across panel headers. */
function HeaderButton(props) {
  return React.createElement(
    "button",
    {
      type: "button",
      title: props.title,
      "aria-label": props.title,
      onClick: props.onClick,
      style: {
        cursor: "pointer",
        background: props.active ? "var(--dsw-alias-interactive-bg-hover, rgba(128,128,128,0.25))" : "transparent",
        border: "1px solid var(--dsw-alias-border-l2, transparent)",
        borderRadius: "6px",
        color: "inherit",
        fontSize: props.fontSize ?? "12px",
        lineHeight: 1,
        padding: "4px 7px"
      }
    },
    props.children
  );
}

/**
 * MindElixir canvas bound to a DOM ref. Renders the `mindmap` projection and
 * pushes user edits back to the host over the Connection RPC channel.
 */
function MindElixirCanvas(props) {
  const containerRef = React.useRef(null);
  const mindRef = React.useRef(null);
  const lastPushedRef = React.useRef(null);
  const suppressRef = React.useRef(false);

  // Create the MindElixir instance once the container mounts.
  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const MindElixirCtor = window.__DSH_MINDE_MINDELIXIR__;
    if (!MindElixirCtor) {
      el.textContent = "MindElixir 内核未加载";
      return undefined;
    }

    const mind = new MindElixirCtor({
      el,
      direction: MindElixirCtor.SIDE,
      editable: true,
      contextMenu: true,
      toolBar: true,
      keypress: true,
      allowUndo: true,
      // NOTE: do NOT pass overflowHidden — in mind-elixir v6 that option
      // skips initMouseEvent entirely, leaving the map dead to clicks
      // (fold/unfold, pan, drag all unbound). We clip via CSS instead.
      theme: MindElixirCtor.THEME
    });
    mindRef.current = mind;
    activeCanvas.mind = mind;

    const data = cloneTree(props.tree);
    lastPushedRef.current = data;
    mind.init(data);
    if (mind.scaleFit) mind.scaleFit();

    // Listen for user operations and push the resulting tree back to the host.
    const onOperation = () => {
      if (suppressRef.current) return;
      try {
        const tree = mind.getData();
        lastPushedRef.current = tree;
        props.onUserEdit(tree);
      } catch (e) {
        console.error("[dsh-mindmap-live] push failed", e);
      }
    };
    mind.bus.addListener("operation", onOperation);
    // Fold/unfold fires `expandNode`, not `operation`; expandNodeAll fires
    // nothing at all, so wrap the method to keep the host in sync.
    mind.bus.addListener("expandNode", onOperation);
    if (typeof mind.expandNodeAll === "function") {
      const origExpandNodeAll = mind.expandNodeAll.bind(mind);
      mind.expandNodeAll = (...args) => {
        const result = origExpandNodeAll(...args);
        onOperation();
        return result;
      };
    }

    return () => {
      try { mind.bus.removeListener("operation", onOperation); } catch (e) { /* ignore */ }
      try { mind.bus.removeListener("expandNode", onOperation); } catch (e) { /* ignore */ }
      try { mind.destroy(); } catch (e) { /* ignore */ }
      if (activeCanvas.mind === mind) activeCanvas.mind = null;
      mindRef.current = null;
    };
  }, []);

  // Refresh whenever the projection changes (agent or other-client edits).
  React.useLayoutEffect(() => {
    const mind = mindRef.current;
    if (!mind) return;
    const incoming = cloneTree(props.tree);
    const last = lastPushedRef.current;
    // Skip the refresh when the incoming tree is exactly what we last pushed
    // (a user edit echoed back through the projection).
    if (last !== null && JSON.stringify(incoming) === JSON.stringify(last)) return;
    suppressRef.current = true;
    try {
      mind.refresh(incoming);
      lastPushedRef.current = incoming;
      if (props.visible && mind.scaleFit) mind.scaleFit();
    } catch (e) {
      console.error("[dsh-mindmap-live] refresh failed", e);
    } finally {
      suppressRef.current = false;
    }
  }, [props.tree, props.visible]);

  return React.createElement(
    "div",
    {
      ref: containerRef,
      "data-dsh-mindmap-canvas": "",
      style: { width: "100%", height: "100%", overflow: "hidden", position: "relative" }
    }
  );
}

/**
 * Header action pair backed by the official @mind-elixir plugins:
 *  - 下载图片: render the live canvas to PNG via export-mindmap's SCST engine
 *    and trigger a browser download (named after the root topic).
 *  - 在桌面应用打开: hand the current tree to Mind Elixir Desktop through
 *    open-desktop (protocol wake-up + local service POST).
 *
 * Both act on the single live canvas via `activeCanvas`; while a plugin call
 * is in flight the button shows an ellipsis and further clicks are ignored.
 * A short-lived inline note reports success/failure without blocking UI.
 */
function MapActions() {
  const [busy, setBusy] = React.useState(null);
  const [note, setNote] = React.useState(null);
  const noteTimerRef = React.useRef(null);

  React.useEffect(() => () => {
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
  }, []);

  const flash = React.useCallback((kind, text) => {
    setNote({ kind, text });
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    noteTimerRef.current = setTimeout(() => setNote(null), 4000);
  }, []);

  const onDownloadImage = async () => {
    if (busy) return;
    const mind = activeCanvas.mind;
    if (!mind || typeof MINDMAP_EXPORT_PLUGIN === "undefined") {
      flash("err", "画布尚未就绪");
      return;
    }
    setBusy("png");
    try {
      await MINDMAP_EXPORT_PLUGIN.downloadImage(mind, "png");
      flash("ok", "PNG 已开始下载");
    } catch (e) {
      console.error("[dsh-mindmap-live] image export failed", e);
      flash("err", "导出失败" + (e && e.message ? "：" + e.message : ""));
    } finally {
      setBusy(null);
    }
  };

  const onOpenDesktop = async () => {
    if (busy) return;
    const mind = activeCanvas.mind;
    if (!mind || typeof MINDMAP_OPEN_DESKTOP_PLUGIN === "undefined") {
      flash("err", "画布尚未就绪");
      return;
    }
    let tree;
    try {
      tree = mind.getData();
    } catch (e) {
      flash("err", "读取导图失败");
      return;
    }
    setBusy("desktop");
    try {
      await MINDMAP_OPEN_DESKTOP_PLUGIN.launchMindElixir(tree, window.location.href);
      flash("ok", "已发送到桌面应用");
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      console.error("[dsh-mindmap-live] open-desktop failed", e);
      flash("err", msg.indexOf("未安装") !== -1 ? "未安装桌面应用，已打开下载页" : "打开失败：" + msg);
    } finally {
      setBusy(null);
    }
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(HeaderButton, {
      title: "下载图片（PNG）",
      onClick: onDownloadImage
    }, busy === "png" ? "…" : "⬇ 图片"),
    React.createElement(HeaderButton, {
      title: "在桌面应用打开",
      onClick: onOpenDesktop
    }, busy === "desktop" ? "…" : "🖥 桌面"),
    note && React.createElement(
      "span",
      {
        role: "status",
        style: {
          fontSize: "11.5px",
          lineHeight: 1.4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "180px",
          color: note.kind === "err"
            ? "var(--dsw-specific-danger, #e5484d)"
            : "var(--dsw-alias-label-secondary, inherit)"
        }
      },
      note.text
    )
  );
}

/** Session-scope child: receives useSession, useProjection, sessionId, connection. */
function MindMapSession(props) {
  const rawTree = props.useProjection(PROJECTION_KEY);
  const tree = React.useMemo(() => normalizeIncomingTree(rawTree), [rawTree]);
  const sessionId = props.sessionId;

  const pushEdit = React.useCallback((tree) => {
    if (!sessionId) return;
    const conn = props.connection;
    if (!conn || !conn.rpc) return;
    conn.rpc.call(RPC_CHANNEL, RPC_ENDPOINT, { sessionId, tree }).catch((e) => {
      console.error("[dsh-mindmap-live] rpc push failed", e);
    });
  }, [sessionId]);

  // No mind map has been created in this session yet — invite the user to
  // build one through conversation instead of showing a placeholder node.
  if (tree === undefined || tree === null) {
    return React.createElement(
      "div",
      {
        "data-dsh-mindmap-empty": "",
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          textAlign: "center",
          padding: "24px",
          color: "var(--dsw-alias-label-secondary, inherit)",
          userSelect: "none"
        }
      },
      React.createElement(
        "img",
        {
          src: MINDMAP_ICON_URI,
          alt: "",
          draggable: false,
          width: 56,
          height: 56,
          style: { borderRadius: "14px", opacity: 0.9 }
        }
      ),
      React.createElement("div", { style: { fontSize: "14px", fontWeight: 600, color: "var(--dsw-alias-label-primary, inherit)" } }, "这个会话还没有思维导图"),
      React.createElement(
        "div",
        { style: { fontSize: "12.5px", lineHeight: 1.7, opacity: 0.85 } },
        "直接在对话里让我来画，例如：",
        React.createElement("br"),
        React.createElement(
          "span",
          { style: { opacity: 0.95 } },
          "“帮我画一张关于××的思维导图”"
        )
      ),
      React.createElement(
        "div",
        { style: { fontSize: "11.5px", opacity: 0.6 } },
        "创建后它会实时出现在这里，你的手动修改也会同步给 AI"
      )
    );
  }

  return React.createElement(MindElixirCanvas, { tree, visible: true, onUserEdit: pushEdit });
}

/**
 * Headless session-scope watcher: renders nothing, but stays mounted whenever
 * a session is staged — independent of panel visibility (both views return
 * null while hidden, so the canvas child cannot host this logic).
 *
 * Auto-open: when the agent creates a mind map for the current session while
 * the panel is hidden, pop the docked panel open once. Only the CREATION edge
 * triggers (projection absent → present); later agent edits never reopen a
 * panel the user closed.
 *
 * The trigger is gated on `openState === "open"`: the projection baseline is
 * seeded synchronously during history-window install, BEFORE the state flips
 * to "open", so the first post-open observation already reflects everything
 * persisted in the log. A page reload or a switch to a session that already
 * has a map therefore records it as the baseline and never auto-opens; only a
 * genuinely new `mindmap/update` event does. And because an empty map can
 * only be written by the agent's `mindmap_set` tool (user edits go through
 * the canvas RPC, which requires an existing tree), absent→present is exactly
 * "the agent created a mind map".
 */
function MindMapAutoOpen(props) {
  const rawTree = props.useProjection(PROJECTION_KEY);
  const tree = React.useMemo(() => normalizeIncomingTree(rawTree), [rawTree]);
  const openState = props.useSession((s) => s.openState);

  const watcherRef = React.useRef({ baselined: false, hadTree: false });
  React.useEffect(() => {
    const ui = props.ui;
    if (!ui || !ui.actions) return;
    const state = watcherRef.current;
    if (openState !== "open") return;
    if (!state.baselined) {
      // Baseline: whatever the seed had at open counts as pre-existing.
      state.baselined = true;
      state.hadTree = tree !== null;
      return;
    }
    if (!state.hadTree && tree !== null && ui.getSnapshot().view === "hidden") {
      ui.actions.showDock();
    }
    state.hadTree = tree !== null;
  }, [props.ui, openState, tree]);

  return null;
}

/**
 * Shared panel body: hint when no session is active, otherwise the
 * session-scoped slot (the live canvas).
 */
function panelBody(props) {
  if (props.currentId === undefined) {
    return React.createElement(
      "div",
      { style: { color: "inherit", opacity: 0.7, fontSize: "13px" } },
      "请先打开一个会话以查看思维导图。"
    );
  }
  return props.renderSlot(SESSION_SLOT, {});
}

// ---------------------------------------------------------------------------
// View 1: docked side panel (chat + map side by side)
// ---------------------------------------------------------------------------

/**
 * Draggable divider on the dock panel's left edge.
 *
 * Pointer drag resizes the panel live: each pointermove patches the width
 * straight onto the panel element and the layout-bridge CSS variable, so no
 * React re-render or store persist happens per frame; the final value is
 * committed to the ui store once on release. Double-click resets to
 * DEFAULT_WIDTH.
 */
function DockResizer(props) {
  const [dragging, setDragging] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const dragRef = React.useRef(null);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startW: props.getWidth() };
    setDragging(true);
  };

  React.useEffect(() => {
    if (!dragging) return undefined;
    document.body.setAttribute("data-dsh-mindmap-resizing", "");
    const onMove = (ev) => {
      const st = dragRef.current;
      if (!st) return;
      props.onPreview(clampWidth(st.startW + (st.startX - ev.clientX)));
    };
    const finish = (ev) => {
      const st = dragRef.current;
      dragRef.current = null;
      setDragging(false);
      if (!st || !ev) return;
      props.onCommit(clampWidth(st.startW + (st.startX - ev.clientX)));
    };
    // Pointercancel carries no coordinates — abort without committing.
    const onCancel = () => finish(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      document.body.removeAttribute("data-dsh-mindmap-resizing");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [dragging]);

  // The bar sits centered on the panel border: handle spans -6px..+6px around
  // it, so a 3px bar goes at left 4.5px inside the handle.
  const barColor = dragging
    ? "var(--dsw-specific-sidebar-nav-item-active, rgba(128,128,128,0.55))"
    : hover
      ? "var(--dsw-alias-border-l2, rgba(128,128,128,0.4))"
      : "transparent";

  return React.createElement(
    "div",
    {
      "data-dsh-mindmap-resizer": "",
      title: "拖拽调整宽度，双击恢复默认",
      "aria-orientation": "vertical",
      onPointerDown,
      onDoubleClick: () => props.onCommit(DEFAULT_WIDTH),
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "-6px",
        width: "12px",
        cursor: "col-resize",
        zIndex: 6,
        touchAction: "none",
        userSelect: "none"
      }
    },
    React.createElement("div", {
      "data-dsh-mindmap-resizer-bar": "",
      style: {
        position: "absolute",
        left: "4.5px",
        top: "0",
        bottom: "0",
        width: "3px",
        borderRadius: "999px",
        background: barColor,
        transition: dragging ? "none" : "background-color 0.15s ease"
      }
    })
  );
}

function MindMapDock(props) {
  const view = props.useStore((s) => s.view);
  const width = props.useStore((s) => s.width);
  const currentId = props.useSessions((s) => s.current);
  const panelRef = React.useRef(null);

  // Live preview during a divider drag: patch the panel width and the layout
  // CSS variable directly so no re-render/persist happens per pointermove;
  // DockResizer commits the final value to the store on release.
  const previewDragWidth = React.useCallback((w) => {
    const px = `${clampWidth(w)}px`;
    if (panelRef.current) panelRef.current.style.width = px;
    document.body.style.setProperty("--dsh-mindmap-dock-w", px);
  }, []);

  // Tell the page we are docked: shifts the chat column left via injected CSS
  // and exposes the current width as a CSS variable. The stored width is
  // clamped at render time so a shrunken viewport can't leave a stale
  // over-wide value on screen (the store itself only updates on drag commit).
  React.useEffect(() => {
    if (view === "dock") {
      document.body.setAttribute("data-dsh-mindmap-dock", "");
      document.body.style.setProperty("--dsh-mindmap-dock-w", `${clampWidth(width)}px`);
    }
    return () => {
      document.body.removeAttribute("data-dsh-mindmap-dock");
    };
  }, [view, width]);

  if (view !== "dock") return null;

  const effWidth = clampWidth(width);

  const panelStyle = {
    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    width: `${effWidth}px`,
    zIndex: 25,
    display: "flex",
    flexDirection: "column",
    background: "var(--dsw-alias-bg-base, #16161a)",
    color: "var(--dsw-alias-label-primary, inherit)",
    borderLeft: "1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.35))",
    boxShadow: "-8px 0 24px rgba(0,0,0,0.18)"
  };
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    borderBottom: "1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.3))",
    flex: "none"
  };
  const bodyStyle = { flex: "1", minHeight: "0", padding: "10px" };

  return React.createElement(
    "div",
    { ref: panelRef, "data-dsh-mindmap-dock-panel": "", style: panelStyle },
    React.createElement(DockResizer, {
      getWidth: () => effWidth,
      onPreview: previewDragWidth,
      onCommit: (w) => props.actions.setWidth(w)
    }),
    React.createElement(
      "div",
      { style: headerStyle },
      React.createElement("img", {
        src: MINDMAP_ICON_URI,
        alt: "",
        draggable: false,
        width: 18,
        height: 18,
        style: { borderRadius: "5px", flex: "none" }
      }),
      React.createElement("strong", { style: { marginRight: "4px" } }, "思维导图"),
      React.createElement(HeaderButton, { title: "全屏模式", onClick: () => props.actions.showFull() }, "⤢"),
      React.createElement(MapActions, null),
      currentId === undefined && React.createElement(
        "span",
        { style: { fontSize: "12px", opacity: 0.7 } }, "（无活动会话）"
      ),
      React.createElement(
        HeaderButton,
        { title: "关闭", onClick: () => props.actions.hide(), style: { marginLeft: "auto" } },
        "✕"
      )
    ),
    React.createElement(
      "div",
      { style: bodyStyle },
      panelBody({ currentId, renderSlot: props.renderSlot })
    )
  );
}

// ---------------------------------------------------------------------------
// View 2: fullscreen overlay (focused mode)
// ---------------------------------------------------------------------------

function MindMapOverlay(props) {
  const view = props.useStore((s) => s.view);
  const currentId = props.useSessions((s) => s.current);

  if (view !== "full") return null;

  const overlayStyle = {
    position: "absolute",
    inset: "0",
    zIndex: 30,
    display: "flex",
    flexDirection: "column",
    background: "var(--dsw-alias-bg-base, rgba(20,20,20,0.97))",
    color: "var(--dsw-alias-label-primary, #fff)"
  };
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderBottom: "1px solid var(--dsw-alias-border-l1, rgba(128,128,128,0.3))",
    flex: "none"
  };
  const bodyStyle = { flex: "1", minHeight: 0, padding: "12px" };

  return React.createElement(
    "div",
    { "data-dsh-mindmap-overlay": "", style: overlayStyle },
    React.createElement(
      "div",
      { style: headerStyle },
      React.createElement("img", {
        src: MINDMAP_ICON_URI,
        alt: "",
        draggable: false,
        width: 18,
        height: 18,
        style: { borderRadius: "5px", flex: "none" }
      }),
      React.createElement("strong", null, "实时思维导图"),
      currentId === undefined &&
        React.createElement("span", { style: { fontSize: "12px", opacity: 0.7 } }, "（无活动会话）"),
      React.createElement(MapActions, null),
      React.createElement(HeaderButton, { title: "回到侧栏模式", onClick: () => props.actions.showDock(), style: { marginLeft: "auto" } }, "⤡ 侧栏"),
      React.createElement(HeaderButton, { title: "关闭", onClick: () => props.actions.hide() }, "✕")
    ),
    React.createElement(
      "div",
      { style: bodyStyle },
      panelBody({ currentId, renderSlot: props.renderSlot })
    )
  );
}

// ---------------------------------------------------------------------------
// Sidebar toggle button
// ---------------------------------------------------------------------------

/**
 * Sidebar footer action button toggling the docked panel.
 *
 * Geometry mirrors the shell's settings trigger row (ui-settings-general
 * `.VOzbGW_trigger` / `.VOzbGW_rail`): a full-width 42px rounded row with a
 * 16px mark plus a label while the sidebar column is expanded (`wide`), and a
 * centered 36x36 round rail button with an 18px mark when it is collapsed.
 * State styling (hover, open-highlight) lives in the stylesheet injected by
 * apply() under `[data-dsh-mindmap-toggle]`, so inline styles stay
 * geometry-only: closed looks exactly like the settings control, open tints
 * with the sidebar nav's active token.
 */
function MindMapButton(props) {
  const view = props.useStore((s) => s.view);
  const active = view !== "hidden";
  // Slot props carry the sidebar shell's `wide` flag (expanded column vs
  // collapsed 56px rail) — the same flag the settings trigger receives.
  const wide = props.wide !== false;
  const onClick = () => props.actions.toggleDock();

  const buttonStyle = {
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    flex: "none",
    overflow: "hidden",
    border: "none",
    color: "var(--dsw-alias-label-primary, inherit)",
    fontFamily: "inherit",
    fontSize: "14px",
    lineHeight: "22px",
    transition: "background-color 0.15s var(--ds-ease-in-out, ease)"
  };
  if (wide) {
    Object.assign(buttonStyle, {
      width: "calc(100% + 4px)",
      height: "42px",
      margin: "4px -2px",
      padding: "0 10px 0 8px",
      gap: "8px",
      borderRadius: "12px"
    });
  } else {
    Object.assign(buttonStyle, {
      width: "36px",
      height: "36px",
      margin: "8px 0 10px",
      padding: "0",
      justifyContent: "center",
      borderRadius: "50%"
    });
  }

  return React.createElement(
    "button",
    {
      type: "button",
      title: active ? "关闭思维导图" : "打开思维导图（侧栏，可边聊边看）",
      "aria-label": active ? "关闭思维导图" : "打开思维导图",
      "aria-pressed": active ? "true" : "false",
      "data-dsh-mindmap-toggle": "",
      "data-dsh-mindmap-active": active ? "true" : "false",
      style: buttonStyle,
      onClick
    },
    React.createElement("img", {
      src: MINDMAP_ICON_URI,
      alt: "",
      draggable: false,
      width: wide ? 16 : 18,
      height: wide ? 16 : 18,
      style: { display: "block", flex: "none", borderRadius: wide ? "4px" : "5px" }
    }),
    wide && React.createElement(
      "span",
      { style: { whiteSpace: "nowrap", overflow: "hidden" } },
      "思维导图"
    )
  );
}

// ---------------------------------------------------------------------------
// apply
// ---------------------------------------------------------------------------

function apply(ctx) {
  const uiStore = createUiStore();

  // The view-mode store is registered once under the ROOT scope (by the
  // sidebar button and the overlay entries); slots enforce "one handle, one
  // scope", so the session-scoped watcher cannot declare it again. Resolve
  // the same shared root instance here and hand it to MindMapAutoOpen through
  // its slot's inject face instead.
  let sharedUi = void 0;
  let sharedUiFailed = false;
  const sharedUiStore = () => {
    if (sharedUi === void 0 && !sharedUiFailed) {
      try {
        sharedUi = ctx.slots.resolveStore(uiStore);
      } catch (e) {
        // No registered instance yet — degrade to no-auto-open rather than
        // crash the watcher entry.
        sharedUiFailed = true;
        console.warn("[dsh-mindmap-live] ui store unavailable, auto-open disabled", e);
      }
    }
    return sharedUi;
  };

  // Layout bridge CSS: when the dock is open, reserve its width so the chat
  // column never hides behind the panel. Hashed class names differ per build,
  // but the semantic suffix ("_centerCol") is stable — match on substring.
  // Narrow screens skip the shift; the panel simply floats above.
  //
  // The same tag also carries the sidebar toggle's state styling (see
  // MindMapButton): closed it behaves exactly like the settings trigger
  // (transparent, hover fill), open it tints with the sidebar nav's active
  // token — the same highlight language settings uses for its active section.
  if (typeof document !== "undefined" && !document.getElementById("dsh-mindmap-live-layout")) {
    const styleEl = document.createElement("style");
    styleEl.id = "dsh-mindmap-live-layout";
    styleEl.textContent = [
      "body[data-dsh-mindmap-dock] [class*=\"_centerCol\"] {",
      "  padding-right: var(--dsh-mindmap-dock-w, 520px);",
      "  transition: padding-right 0.16s ease;",
      "}",
      "@media (max-width: 1023px) {",
      "  body[data-dsh-mindmap-dock] [class*=\"_centerCol\"] { padding-right: 0; }",
      "}",
      // While a divider drag is live: keep text selection off and force the
      // resize cursor everywhere so sweeping across the canvas stays clean.
      "body[data-dsh-mindmap-resizing] { user-select: none !important; }",
      "body[data-dsh-mindmap-resizing] * { cursor: col-resize !important; }",
      "button[data-dsh-mindmap-toggle] { background: transparent; }",
      "button[data-dsh-mindmap-toggle]:hover {",
      "  background: var(--dsw-alias-interactive-bg-hover);",
      "}",
      "button[data-dsh-mindmap-toggle][data-dsh-mindmap-active=\"true\"] {",
      "  background: var(--dsw-specific-sidebar-nav-item-active, rgba(128,128,128,0.22));",
      "}",
      "button[data-dsh-mindmap-toggle][data-dsh-mindmap-active=\"true\"]:hover {",
      "  background: var(--dsw-specific-sidebar-nav-item-hover, rgba(128,128,128,0.3));",
      "}"
    ].join("\n");
    document.head.appendChild(styleEl);
  }

  ctx.slots.inject("sidebar.footer.action", () =>
    ctx.slots.register(
      {
        name: "sidebar.footer.action",
        id: OVERLAY_ID,
        order: 10,
        label: () => "思维导图",
        store: uiStore
      },
      MindMapButton
    )
  );

  ctx.slots.inject("shell.overlay", () =>
    ctx.slots.register(
      {
        name: "shell.overlay",
        id: OVERLAY_ID,
        order: 10,
        store: uiStore,
        children: {
          [SESSION_SLOT]: { kind: "single", scope: "session" },
          [AUTO_OPEN_SLOT]: { kind: "single", scope: "session" }
        }
      },
      // One parent renders both views; each returns null unless active, so
      // exactly one canvas instance exists at any time. The auto-open watcher
      // is headless and renders unconditionally — it must observe the
      // projection precisely while the panel is hidden.
      (props) => React.createElement(
        React.Fragment,
        null,
        React.createElement(MindMapDock, props),
        React.createElement(MindMapOverlay, props),
        props.renderSlot(AUTO_OPEN_SLOT, {})
      )
    )
  );

  ctx.slots.inject(SESSION_SLOT, () =>
    ctx.slots.register(
      {
        name: SESSION_SLOT,
        priority: 0,
        inject: () => ({ connection: ctx.get("connection") })
      },
      MindMapSession
    )
  );

  ctx.slots.inject(AUTO_OPEN_SLOT, () =>
    ctx.slots.register(
      {
        name: AUTO_OPEN_SLOT,
        priority: 0,
        inject: () => ({ ui: sharedUiStore() })
      },
      MindMapAutoOpen
    )
  );
}

module.exports = { apply, inject: ["slots", "sessions", "connection"] };


    return module.exports;
  }
});
