// import { motionValue, animate } from "motion";
// import gsap from "gsap";
// // import { CustomEase } from "gsap/CustomEase";
// // import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { Flip } from "gsap/dist/Flip";
// import { Draggable } from "gsap/dist/Draggable";
// gsap.registerPlugin(ScrollTrigger, Draggable, Flip);
// export default function setLayout() {
//   const main = document.querySelector("#main") as HTMLElement;
//   const main__content = document.querySelector("#main__content") as HTMLElement;
//   const main__content_in = document.querySelector(
//     "#main__content--in",
//   ) as HTMLElement;
//   let aspect_ratio_og = 1920 / 1080;
//   let aspect_ratio = window.innerWidth / window.innerHeight;
//   let initial_set = {
//     width: 0,
//     height: 0,
//   };
//   let zoom_set = {
//     width: 0,
//     height: 0,
//   };
//   const resizing = () => {
//     aspect_ratio = window.innerWidth / window.innerHeight;
//     if (window.matchMedia(`(min-aspect-ratio: ${aspect_ratio_og})`).matches) {
//       initial_set.width = window.innerHeight * aspect_ratio_og;
//       initial_set.height = window.innerHeight;
//       zoom_set.width = window.innerWidth;
//       zoom_set.height = window.innerWidth / aspect_ratio_og;
//     } else {
//       initial_set.width = window.innerWidth;
//       initial_set.height = window.innerWidth / aspect_ratio_og;
//       zoom_set.width = window.innerHeight * aspect_ratio_og;
//       zoom_set.height = window.innerHeight;
//     }
//   };
//   window.addEventListener("resize", resizing);
//   resizing();
//   // gsap.fromTo(
//   //   "#main__content--in",
//   //   {
//   //     scale: initial_set.width / 1920,
//   //   },
//   //   {
//   //     scale: (initial_set.width / 1920) * 1.5,
//   //     duration: 1.5,
//   //     delay: 1.5,
//   //     ease: "power2.inOut",
//   //   },
//   // );

//   // const x = motionValue(0);
//   // let velocity = x.getVelocity();
//   // Draggable.create("#main__content--in", {
//   //   bounds: "#main",
//   //   inertia: true,
//   //   dragResistance: 0.5,
//   //   onDrag: (e) => {
//   //     if (e.x) {
//   //       x.set(e.x);
//   //     }
//   //   },
//   //   onDragEnd: (e) => {
//   //     if (e.x) {
//   //       x.set(e.x);
//   //     }
//   //   },
//   // });
//   // x.on("change", () => {
//   //   velocity = x.getVelocity();
//   //   console.log(velocity);
//   // });
// }
