window.addEventListener("load", () => {
  const minimize = document.getElementById("win-minimize");
  const restore = document.getElementById("win-restore");
  const maximize = document.getElementById("win-maximize");
  const close = document.getElementById("win-close");

  const update_maxi_restore_btn = (res) => {
    if (res) {
      maximize.style.display = "none";
      restore.style.display = "inherit";
    } else {
      maximize.style.display = "inherit";
      restore.style.display = "none";
    }
  };

  const maxi_restore = () => {
    MainWindow.invoke("win:maxi_restore").then((res) =>
      update_maxi_restore_btn(res)
    );
  };

  MainWindow.invoke("win:isMaximized").then((res) => {
    update_maxi_restore_btn(res);
  });

  minimize.addEventListener("click", () => {
    MainWindow.send("win:minimize");
  });

  maximize.addEventListener("click", maxi_restore);
  restore.addEventListener("click", maxi_restore);

  close.addEventListener("click", () => {
    MainWindow.send("win:close");
  });

  MainWindow.on("win:maximize", () => {
    update_maxi_restore_btn(true);
  });
  MainWindow.on("win:restore", () => {
    update_maxi_restore_btn(false);
  });
  MainWindow.on("win:unmaximize", () => {
    update_maxi_restore_btn(false);
  });
});
