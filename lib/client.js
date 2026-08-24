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

/* global MINDMAP_ICON_URI */
/**
 * Plugin logo, injected by build.mjs (inlined base64 data URI of
 * assets/icon.png) ahead of this body inside the same factory scope.
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
