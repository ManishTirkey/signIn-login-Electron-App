window.addEventListener("load", () => {
  const minimize = document.getElementById("win-minimize");
  const restore = document.getElementById("win-restore");
  const maximize = document.getElementById("win-maximize");
  const close = document.getElementById("win-close");

  const update_maxi_restore_btn = (res) => {
    if (res) {
      maximize.style.zIndex = "-1";
      restore.style.zIndex = "10";
    } else {
      maximize.style.zIndex = "10";
      restore.style.zIndex = "-1";
    }
  };

  const maxi_restore = () => {
    window_title_bar
      .invoke("win:maxi_restore")
      .then((res) => update_maxi_restore_btn(res));
  };

  window_title_bar.invoke("win:isMaximized").then((res) => {
    update_maxi_restore_btn(res);
  });

  minimize.addEventListener("click", () => {
    window_title_bar.send("win:minimize");
  });

  maximize.addEventListener("click", maxi_restore);
  restore.addEventListener("click", maxi_restore);

  close.addEventListener("click", () => {
    window_title_bar.send("win:close");
  });

  window_title_bar.on("win:maximize", () => {
    update_maxi_restore_btn(true);
  });
  window_title_bar.on("win:restore", () => {
    update_maxi_restore_btn(false);
  });
  window_title_bar.on("win:unmaximize", () => {
    update_maxi_restore_btn(false);
  });
});
