/**！
 * 简化版加载命名隔离工具
 * License：MIT
 * @author rectcircle
 * 
 */
;(function(golab){
	var namespace ={};
	window.define = function(){
		var name = arguments[0],dependence,fun;
		if(arguments.length===3){
			dependence = arguments[1];
			fun = arguments[2];
		} else if(arguments.length===2){
			dependence = [];
			fun = arguments[1];
		}
		namespace[name] = {
			dependence:dependence,
			fun:fun,
			obj:null
		};
	};

	function _inject(name){
		if(namespace[name].obj===null){ /*未初始化*/
			if(namespace[name].dependence.length===0){  /*不存在依赖*/
				namespace[name].obj = namespace[name].fun();
			} else { /*存在依赖*/
				var injection =[];
				namespace[name].dependence.forEach(function (e){
					if(namespace[e].obj===null){
						injection.push(_inject(e));
					} else {
						injection.push(namespace[e].obj);
					}
				});
				namespace[name].obj = namespace[name].fun.apply(this, injection);
			}
		}
		return namespace[name].obj;
	}

	window.main = function(){
		var dependence,fun;
		if(arguments.length===1){
			dependence = [];
			fun = arguments[0];
		} else if(arguments.length===2){
			dependence = arguments[0];
			fun = arguments[1];
		}
		define("main",dependence,fun);
		_inject("main");
	};

})(window);

