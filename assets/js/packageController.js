var Package = {};
mainApp.controller("packageController", function ($scope) {
	Package = {
		init: function () {
			Package.load();
			

			//bind Event
			$("#sell").click(function () {
				Main.sell(0);
			});
			$("#refresh").click(function () {
				if($(this).attr('data-run') === "true") {
					return $(this).attr('data-stop',true);
				};
				Package.load(true);
			});
		},
		load: function (loadSimilar) {
			loadSimilar = loadSimilar || false;
			//if u're using '$http' will be able to get the data, I don't know why
			$.ajax({
				url: Main.url("create"),
				success: function (res) {
					var datas = res.getElementById("inventories").innerHTML;
					var re = /(AuctionCreate.items*?[^)]+);/g;
					eval(re.exec(datas)[0].replace("AuctionCreate","Model"));
					Model.store();
					Main.bind();

					if(Model.config.updateSimilar || loadSimilar){
						Main.similar(null, 0, false);
					}else{
						$("#refresh").text("刷新");
						$("#refresh").attr('data-run',false);
						Main.status();
					}
				},
				error: function (err) {
					if(confirm("网络异常，请重新打开。点击确定将退出程序")){
						var gui = require('nw.gui');
						gui.Window.get().close(true);
					}
				},
				beforeSend: function () {
					$("#refresh").text("暂停");
					$("#refresh").attr("data-run",true);
					Main.status("商品列表更新中...");
				}
			})
		}
	}
})