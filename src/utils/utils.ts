const log = function (msg: string) {
  return function (v: any) {
    const desc = msg + " => " + v;
    console.log(desc);
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(desc));
			if (document.getElementById("app")?.appendChild(li) ?? false) {console.log("app div not found")};
  };
};

export { log };
