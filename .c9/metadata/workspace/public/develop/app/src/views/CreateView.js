{"filter":false,"title":"CreateView.js","tooltip":"/public/develop/app/src/views/CreateView.js","undoManager":{"mark":100,"position":100,"stack":[[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":379,"column":28},"end":{"row":379,"column":29}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":379,"column":28},"end":{"row":379,"column":29}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":379,"column":29},"end":{"row":379,"column":30}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":379,"column":30},"end":{"row":379,"column":31}},"text":"i"},{"action":"insertText","range":{"start":{"row":379,"column":31},"end":{"row":379,"column":32}},"text":"t"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":379,"column":28},"end":{"row":379,"column":32}},"text":"init"},{"action":"insertText","range":{"start":{"row":379,"column":28},"end":{"row":379,"column":40}},"text":"initialXaxis"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":379,"column":41},"end":{"row":379,"column":42}},"text":";"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":338,"column":61},"end":{"row":339,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":339,"column":0},"end":{"row":339,"column":20}},"text":"                    "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":339,"column":20},"end":{"row":340,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":340,"column":0},"end":{"row":340,"column":20}},"text":"                    "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":340,"column":20},"end":{"row":340,"column":71}},"text":"var remainder = Math.abs(this.xAxis) % scaledWidth;"},{"action":"insertText","range":{"start":{"row":340,"column":71},"end":{"row":341,"column":0}},"text":"\n"},{"action":"insertLines","range":{"start":{"row":341,"column":0},"end":{"row":360,"column":0}},"lines":["                var sign = remainder >= scaledWidth / 2 ? -1 : 1;","                var adjust = remainder >= scaledWidth / 2 ? -1 * remainder + scaledWidth : -1 * remainder;","                ","                ","                if (this.xAxis < 0) {","                    this.xAxis = this.xAxis - adjust - sign * extraDiff;","                    ","                    // send it back to the last metacode if you've 'gone too far'","                    if (Math.abs(this.xAxis) > maxDiff){","                        this.xAxis = -1 * maxDiff;","                    }","                }","                else if (this.xAxis >= 0) {","                    this.xAxis = this.xAxis + adjust + sign * extraDiff;","                    ","                    // send it back to the last metacode if you've 'gone too far'","                    if (Math.abs(this.xAxis) > maxDiff){ ","                        this.xAxis = maxDiff;","                    }"]},{"action":"insertText","range":{"start":{"row":360,"column":0},"end":{"row":360,"column":17}},"text":"                }"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":359,"column":0},"end":{"row":359,"column":21}},"text":"                    }"},{"action":"removeLines","range":{"start":{"row":355,"column":0},"end":{"row":359,"column":0}},"nl":"\n","lines":["                    ","                    // send it back to the last metacode if you've 'gone too far'","                    if (Math.abs(this.xAxis) > maxDiff){ ","                        this.xAxis = maxDiff;"]},{"action":"removeText","range":{"start":{"row":354,"column":72},"end":{"row":355,"column":0}},"text":"\n"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":351,"column":0},"end":{"row":351,"column":21}},"text":"                    }"},{"action":"removeLines","range":{"start":{"row":347,"column":0},"end":{"row":351,"column":0}},"nl":"\n","lines":["                    ","                    // send it back to the last metacode if you've 'gone too far'","                    if (Math.abs(this.xAxis) > maxDiff){","                        this.xAxis = -1 * maxDiff;"]},{"action":"removeText","range":{"start":{"row":346,"column":72},"end":{"row":347,"column":0}},"text":"\n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":341,"column":0},"end":{"row":341,"column":4}},"text":"    "},{"action":"insertText","range":{"start":{"row":342,"column":0},"end":{"row":342,"column":4}},"text":"    "},{"action":"insertText","range":{"start":{"row":343,"column":0},"end":{"row":343,"column":4}},"text":"    "},{"action":"insertText","range":{"start":{"row":344,"column":0},"end":{"row":344,"column":4}},"text":"    "},{"action":"insertText","range":{"start":{"row":345,"column":0},"end":{"row":345,"column":4}},"text":"    "},{"action":"insertText","range":{"start":{"row":346,"column":0},"end":{"row":346,"column":4}},"text":"    "},{"action":"insertText","range":{"start":{"row":347,"column":0},"end":{"row":347,"column":4}},"text":"    "},{"action":"insertText","range":{"start":{"row":348,"column":0},"end":{"row":348,"column":4}},"text":"    "},{"action":"insertText","range":{"start":{"row":349,"column":0},"end":{"row":349,"column":4}},"text":"    "},{"action":"insertText","range":{"start":{"row":350,"column":0},"end":{"row":350,"column":4}},"text":"    "}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":345,"column":0},"end":{"row":345,"column":20}},"text":"                    "},{"action":"removeLines","range":{"start":{"row":344,"column":0},"end":{"row":345,"column":0}},"nl":"\n","lines":["                    "]},{"action":"removeText","range":{"start":{"row":343,"column":20},"end":{"row":344,"column":0}},"text":"\n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":311,"column":77},"end":{"row":312,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":312,"column":0},"end":{"row":312,"column":16}},"text":"                "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":312,"column":16},"end":{"row":313,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":313,"column":0},"end":{"row":313,"column":16}},"text":"                "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":16},"end":{"row":313,"column":17}},"text":"v"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":17},"end":{"row":313,"column":18}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":18},"end":{"row":313,"column":19}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":19},"end":{"row":313,"column":20}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":20},"end":{"row":313,"column":21}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":21},"end":{"row":313,"column":22}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":22},"end":{"row":313,"column":23}},"text":"m"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":313,"column":20},"end":{"row":313,"column":23}},"text":"rem"},{"action":"insertText","range":{"start":{"row":313,"column":20},"end":{"row":313,"column":29}},"text":"remainder"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":29},"end":{"row":313,"column":30}},"text":","}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":30},"end":{"row":313,"column":31}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":31},"end":{"row":313,"column":32}},"text":"s"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":32},"end":{"row":313,"column":33}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":33},"end":{"row":313,"column":34}},"text":"z"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":34},"end":{"row":313,"column":35}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":35},"end":{"row":313,"column":36}},"text":","}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":36},"end":{"row":313,"column":37}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":37},"end":{"row":313,"column":38}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":38},"end":{"row":313,"column":39}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":39},"end":{"row":313,"column":40}},"text":"j"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":40},"end":{"row":313,"column":41}},"text":"u"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":41},"end":{"row":313,"column":42}},"text":"s"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":42},"end":{"row":313,"column":43}},"text":"t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":313,"column":43},"end":{"row":313,"column":44}},"text":";"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":342,"column":23},"end":{"row":342,"column":24}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":342,"column":22},"end":{"row":342,"column":23}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":342,"column":21},"end":{"row":342,"column":22}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":342,"column":20},"end":{"row":342,"column":21}},"text":"v"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":343,"column":23},"end":{"row":343,"column":24}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":343,"column":22},"end":{"row":343,"column":23}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":343,"column":21},"end":{"row":343,"column":22}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":343,"column":20},"end":{"row":343,"column":21}},"text":"v"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":344,"column":23},"end":{"row":344,"column":24}},"text":" "}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":344,"column":22},"end":{"row":344,"column":23}},"text":"r"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":344,"column":21},"end":{"row":344,"column":22}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":344,"column":20},"end":{"row":344,"column":21}},"text":"v"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":346,"column":24},"end":{"row":346,"column":34}},"text":"this.xAxis"},{"action":"insertText","range":{"start":{"row":346,"column":24},"end":{"row":346,"column":36}},"text":"initialXaxis"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":349,"column":24},"end":{"row":349,"column":34}},"text":"this.xAxis"},{"action":"insertText","range":{"start":{"row":349,"column":24},"end":{"row":349,"column":36}},"text":"initialXaxis"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":340,"column":0},"end":{"row":340,"column":20}},"text":"                    "},{"action":"removeText","range":{"start":{"row":339,"column":20},"end":{"row":339,"column":46}},"text":"initialXaxis = this.xAxis;"},{"action":"removeText","range":{"start":{"row":339,"column":20},"end":{"row":340,"column":0}},"text":"\n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":0,"column":43},"end":{"row":1,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":1,"column":0},"end":{"row":1,"column":4}},"text":"    "}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":1,"column":4},"end":{"row":1,"column":35}},"text":"require('audio/AudioRecorder');"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":1,"column":35},"end":{"row":2,"column":0}},"text":"\n"},{"action":"insertText","range":{"start":{"row":2,"column":0},"end":{"row":2,"column":4}},"text":"    "}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":184,"column":12},"end":{"row":184,"column":17}},"text":"Audio"},{"action":"insertText","range":{"start":{"row":184,"column":12},"end":{"row":184,"column":13}},"text":"w"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":13},"end":{"row":184,"column":14}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":14},"end":{"row":184,"column":15}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":184,"column":14},"end":{"row":184,"column":15}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":14},"end":{"row":184,"column":15}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":15},"end":{"row":184,"column":16}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":16},"end":{"row":184,"column":17}},"text":"o"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":17},"end":{"row":184,"column":18}},"text":"w"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":18},"end":{"row":184,"column":19}},"text":"."}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":19},"end":{"row":184,"column":20}},"text":"m"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":20},"end":{"row":184,"column":21}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":21},"end":{"row":184,"column":22}},"text":"t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":22},"end":{"row":184,"column":23}},"text":"a"},{"action":"insertText","range":{"start":{"row":184,"column":23},"end":{"row":184,"column":24}},"text":"m"},{"action":"insertText","range":{"start":{"row":184,"column":24},"end":{"row":184,"column":25}},"text":"a"},{"action":"insertText","range":{"start":{"row":184,"column":25},"end":{"row":184,"column":26}},"text":"p"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":184,"column":26},"end":{"row":184,"column":27}},"text":"s"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":195,"column":12},"end":{"row":195,"column":17}},"text":"Audio"},{"action":"insertText","range":{"start":{"row":195,"column":12},"end":{"row":195,"column":13}},"text":"w"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":13},"end":{"row":195,"column":14}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":14},"end":{"row":195,"column":15}},"text":"n"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":15},"end":{"row":195,"column":16}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":16},"end":{"row":195,"column":17}},"text":"o"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":17},"end":{"row":195,"column":18}},"text":"w"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":18},"end":{"row":195,"column":19}},"text":"."}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":19},"end":{"row":195,"column":20}},"text":"m"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":20},"end":{"row":195,"column":21}},"text":"e"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":21},"end":{"row":195,"column":22}},"text":"t"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":22},"end":{"row":195,"column":23}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":23},"end":{"row":195,"column":24}},"text":"a"},{"action":"insertText","range":{"start":{"row":195,"column":24},"end":{"row":195,"column":25}},"text":"m"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":195,"column":24},"end":{"row":195,"column":25}},"text":"m"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":24},"end":{"row":195,"column":25}},"text":"m"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":195,"column":24},"end":{"row":195,"column":25}},"text":"m"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":195,"column":23},"end":{"row":195,"column":24}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":23},"end":{"row":195,"column":24}},"text":"m"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":24},"end":{"row":195,"column":25}},"text":"a"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":25},"end":{"row":195,"column":26}},"text":"p"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":195,"column":26},"end":{"row":195,"column":27}},"text":"s"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":2,"column":0},"end":{"row":2,"column":4}},"text":"    "},{"action":"removeLines","range":{"start":{"row":1,"column":0},"end":{"row":2,"column":0}},"nl":"\n","lines":["    require('audio/AudioRecorder');"]}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":183,"column":12},"end":{"row":183,"column":27}},"text":"window.metamaps"},{"action":"insertText","range":{"start":{"row":183,"column":12},"end":{"row":183,"column":13}},"text":"A"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":183,"column":13},"end":{"row":183,"column":14}},"text":"u"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":183,"column":14},"end":{"row":183,"column":15}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":183,"column":15},"end":{"row":183,"column":16}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":183,"column":16},"end":{"row":183,"column":17}},"text":"o"}]}],[{"group":"doc","deltas":[{"action":"removeText","range":{"start":{"row":194,"column":12},"end":{"row":194,"column":27}},"text":"window.metamaps"},{"action":"insertText","range":{"start":{"row":194,"column":12},"end":{"row":194,"column":13}},"text":"A"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":194,"column":13},"end":{"row":194,"column":14}},"text":"u"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":194,"column":14},"end":{"row":194,"column":15}},"text":"d"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":194,"column":15},"end":{"row":194,"column":16}},"text":"i"}]}],[{"group":"doc","deltas":[{"action":"insertText","range":{"start":{"row":194,"column":16},"end":{"row":194,"column":17}},"text":"o"}]}]]},"ace":{"folds":[],"scrolltop":2340,"scrollleft":0,"selection":{"start":{"row":194,"column":17},"end":{"row":194,"column":17},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1403556740822,"hash":"8d18227d27126aa00a713d031d8f53e6c394bb7f"}