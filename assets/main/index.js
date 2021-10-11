window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  MouseDragger: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f28ec3/g79PiLveO9wzqwUs", "MouseDragger");
    "use strict";
    var TouchDragger = cc.Class({
      extends: cc.Component,
      properties: {
        propagate: {
          default: false
        },
        text: "",
        node_x: 0,
        node_y: 0,
        tuched: false,
        isCorrect: false,
        otherNode: {
          type: cc.Node,
          default: null
        },
        orderIndex: -1,
        dragStatus: false
      },
      onLoad: function onLoad() {
        this.node_x = this.node.x;
        this.node_y = this.node.y;
        cc.director.getCollisionManager().enabled = true;
        this._down = false;
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
          if (!this.dragStatus) return;
          cc.log("Drag stated ...");
          this._down = true;
          this.propagate || event.stopPropagation();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
          if (!this.dragStatus) return;
          if (!this._down) {
            event.stopPropagation();
            return;
          }
          var delta = event.getDelta();
          this.node.x += delta.x;
          this.node.y += delta.y;
          this.propagate || event.stopPropagation();
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event) {
          if (!this._down) {
            event.stopPropagation();
            return;
          }
          this._down = false;
          var parentScript = this.node.parent.getComponent("main");
          console.log(this.tuched, this.isCorrect);
          console.log(this.orderIndex, parentScript.orderArr[parentScript.currentIndex]);
          if (true == this.tuched && true == this.isCorrect && this.orderIndex == parentScript.orderArr[parentScript.currentIndex]) {
            this.node.y = 2e3;
            this.otherNode.setText();
            parentScript.answerCorrect();
          } else {
            this.node.x = this.node_x;
            this.node.y = this.node_y;
            parentScript.answerWrong();
          }
        }, this);
      },
      onCollisionEnter: function onCollisionEnter(other) {
        var that = this;
        that.tuched = true;
        that.otherNode = other.node.getComponent("word");
        var other_text = "";
        other_text = that.otherNode ? that.otherNode.text : "";
        var self_text = that.text;
        that.isCorrect = self_text == other_text;
      },
      onCollisionStay: function onCollisionStay(other) {},
      onCollisionExit: function onCollisionExit() {
        var that = this;
        that.tuched = false;
        console.log(that.tuched);
      },
      reset: function reset() {
        var that = this;
        that.node.x = that.node_x;
        that.node.y = that.node_y;
      },
      setDragStatus: function setDragStatus(flag) {
        var that = this;
        that.dragStatus = flag;
      }
    });
    cc._RF.pop();
  }, {} ],
  main: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "705efhuUUJMY4uokxx1OpRg", "main");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        audioIntro: {
          type: cc.AudioSource,
          default: null
        },
        audioCorrect: {
          type: cc.AudioSource,
          default: null
        },
        audioWrong: {
          type: cc.AudioSource,
          default: null
        },
        audioSuccess: {
          type: cc.AudioSource,
          default: null
        },
        problemArr: {
          type: [ cc.AudioSource ],
          default: []
        },
        proNodes: {
          type: cc.Node,
          default: []
        },
        anNodes: {
          type: cc.Node,
          default: []
        },
        btnPlay: {
          type: cc.Node,
          default: null
        },
        btnRestart: {
          type: cc.Node,
          default: null
        },
        particle: {
          type: cc.Node,
          default: null
        },
        orderArr: [ 7 ],
        currentIndex: 0
      },
      onLoad: function onLoad() {
        cc.debug.setDisplayStats(false);
        var that = this;
        for (var i = 0; i < 7; i++) that.orderArr[i] = i;
      },
      randomIntFromInterval: function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      },
      arrangeOrder: function arrangeOrder() {
        var that = this;
        var tmp = 0;
        var randNum = 0;
        for (var i = 0; i < 7; i++) {
          randNum = that.randomIntFromInterval(0, 6);
          tmp = that.orderArr[i];
          that.orderArr[i] = that.orderArr[randNum];
          that.orderArr[randNum] = tmp;
          var proNode = that.proNodes[i];
          proNode.getComponent("word").start();
          var anNode = that.anNodes[i];
          anNode.getComponent("MouseDragger").reset();
        }
        that.currentIndex = 0;
      },
      speakProblem: function speakProblem() {
        var that = this;
        that.setAnswerDrag(false);
        var idx = that.orderArr[that.currentIndex];
        var audioProblem = that.problemArr[idx];
        var problem_duaration = audioProblem.getDuration().toFixed(1);
        audioProblem.play();
        setTimeout(function() {
          that.setAnswerDrag(true);
        }, 2e3);
      },
      setAnswerDrag: function setAnswerDrag(flag) {
        var that = this;
        for (var i = 0; i < 7; i++) {
          var anNode = that.anNodes[i];
          anNode.getComponent("MouseDragger").setDragStatus(flag);
        }
        that.btnPlay.active = flag;
        that.btnRestart.active = flag;
      },
      next: function next() {
        var that = this;
        if (that.currentIndex < 6) {
          that.currentIndex += 1;
          that.speakProblem();
        } else {
          var audioSuccess = that.audioSuccess;
          audioSuccess.play();
          that.particle.getComponent("particle").setParticle();
        }
      },
      answerCorrect: function answerCorrect() {
        var that = this;
        that.setAnswerDrag(false);
        var that = this;
        var correctAudio = that.audioCorrect;
        correctAudio.play();
        setTimeout(function() {
          that.next();
        }, 3e3);
      },
      answerWrong: function answerWrong() {
        var that = this;
        that.setAnswerDrag(false);
        var that = this;
        var wrongAudio = that.audioWrong;
        wrongAudio.play();
        setTimeout(function() {
          that.setAnswerDrag(true);
        }, 4e3);
      },
      pause: function pause() {},
      stop: function stop() {},
      resume: function resume() {},
      startGame: function startGame() {
        var that = this;
        that.setAnswerDrag(false);
        var audioStart = that.audioIntro;
        var start_duaration = 6e3;
        audioStart.play();
        that.arrangeOrder();
        console.log(that.orderArr);
        setTimeout(function() {
          that.speakProblem();
        }, start_duaration);
      }
    });
    cc._RF.pop();
  }, {} ],
  particle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ae8a66i40hGtqO4S6ixSTg8", "particle");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        startStatus: false,
        ang: -90,
        radius: 300
      },
      onLoad: function onLoad() {
        this.startStatus = false;
      },
      setParticle: function setParticle() {
        this.startStatus = true;
      },
      update: function update(dt) {
        if (this.startStatus) {
          this.ang += 2;
          var rad = 3.14 * this.ang / 180;
          this.node.x = this.radius * Math.cos(rad);
          this.node.y = this.radius * Math.sin(rad) - 150;
          if (this.ang > 270) {
            this.startStatus = false;
            this.ang = -90;
          }
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  word: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "44fd6aDFN5CdbBjxDEnzJvj", "word");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        wordLabel: {
          default: null,
          type: cc.Label
        },
        text: ""
      },
      onLoad: function onLoad() {
        cc.director.getCollisionManager().enabled = true;
        var self = this;
      },
      setText: function setText() {
        var self = this;
        self.wordLabel.string = self.text;
      },
      start: function start() {
        var self = this;
        self.wordLabel.string = "";
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "MouseDragger", "main", "particle", "word" ]);