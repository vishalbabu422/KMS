import { useEffect } from "react";

const InboxSearchHandler = () => {
  useEffect(() => {
    const input = document.getElementById("search-kms-inbox");
    const list = document.querySelectorAll(
      "#add-member .contactul li"
    );

    if (!input || !list.length) return;

    const handler = (e) => {
      const value = e.target.value.toLowerCase();

      list.forEach((item) => {
        item.style.display = item.textContent
          .toLowerCase()
          .includes(value)
          ? ""
          : "none";
      });
    };

    input.addEventListener("keyup", handler);

    return () => {
      input.removeEventListener("keyup", handler);
    };
  }, []);

  return null;
};

export default InboxSearchHandler;
