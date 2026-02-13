import { motionValue, springValue, styleEffect } from "motion";
import gsap from "gsap";
import { Draggable } from "gsap/dist/Draggable";
import { Flip } from "gsap/dist/Flip";
import { InertiaPlugin } from "gsap/dist/InertiaPlugin";
type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};
gsap.registerPlugin(Draggable, Flip, InertiaPlugin);
export default class setLayout_ {
  private grid: HTMLElement = document.querySelector(".grid") as HTMLElement;
  private dom: HTMLElement = document.querySelector(
    ".container",
  ) as HTMLElement;
  private details: HTMLElement = document.querySelector(
    ".details",
  ) as HTMLElement;
  private currentProduct: HTMLElement | null = null;
  private originalParent: HTMLElement | null = null;
  private detailsThumb: HTMLElement = document.querySelector(
    ".details__thumb",
  ) as HTMLElement;
  private close: HTMLElement = document.querySelector("#close") as HTMLElement;
  private products: NodeListOf<HTMLDivElement> =
    document.querySelectorAll<HTMLDivElement>(".product div img");
  private draggable!: Draggable;
  private movingFlag: boolean = false;
  constructor() {
    this.intro();
  }
  public centerGrid() {
    const gridWidth = this.grid.offsetWidth;
    const gridHeight = this.grid.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const centerX = (windowWidth - gridWidth) / 2;
    const centerY = (windowHeight - gridHeight) / 2;

    gsap.set(this.grid, {
      x: centerX,
      y: centerY,
    });
  }
  public intro() {
    this.centerGrid();

    const timeline = gsap.timeline();

    timeline.set(this.dom, { scale: 0.5 });
    timeline.set(this.products, {
      scale: 0.5,
      opacity: 0,
    });

    timeline.to(this.products, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      stagger: { amount: 1.2, from: "random" },
    });
    timeline.to(this.dom, {
      scale: 1,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        this.dom.style.overflow = "hidden";

        this.setupDraggable();
        this.setWheelScroll();
        this.setObserver();
        this.setClick();
        this.setMouseTrack();
      },
    });
  }
  public setupDraggable() {
    this.draggable = Draggable.create(this.grid, {
      type: "x,y",
      // bounds: this.container,
      // bounds: {
      //   minX: -(this.grid.offsetWidth - window.innerWidth) - 200,
      //   maxX: 200,
      //   minY: -(this.grid.offsetHeight - window.innerHeight) - 100,
      //   maxY: 100,
      // },
      inertia: true,
      allowEventDefault: true,
      edgeResistance: 0.9,
    })[0];
  }
  public setWheelScroll() {
    window.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();

        const deltaX = -e.deltaX * 7;
        const deltaY = -e.deltaY * 7;

        const currentX = parseInt(gsap.getProperty(this.grid, "x").toString());
        const currentY = parseInt(gsap.getProperty(this.grid, "y").toString());

        const newX = currentX + deltaX;
        const newY = currentY + deltaY;

        const bounds = this.draggable.vars.bounds as Bounds;
        if (typeof bounds == "undefined" || bounds == null) {
          return;
        }

        const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));
        const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, newY));

        gsap.to(this.grid, {
          x: clampedX,
          y: clampedY,
          duration: 0.3,
          ease: "power3.out",
        });
      },
      { passive: false },
    );
  }
  public setObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === this.currentProduct) return;
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          } else {
            gsap.to(entry.target, {
              opacity: 0,
              scale: 0.5,
              duration: 0.5,
              ease: "power2.in",
            });
          }
        });
      },
      { root: null, threshold: 0.1 },
    );
    this.products.forEach((product) => {
      observer.observe(product);
    });
  }
  public setClick() {
    this.products.forEach((product) => {
      product.addEventListener("click", () => {
        this.showDetails(product);
      });
    });
    this.close.addEventListener("click", () => {
      this.unFlipProduct();
    });
  }
  public showDetails(product: HTMLElement) {
    if (this.movingFlag) return;
    this.movingFlag = true;
    this.close.classList.add("active");
    gsap.to(this.dom, {
      x: "-50vw",
      duration: 1.2,
      ease: "power3.inOut",
    });
    gsap.to(this.close, {
      x: "-50vw",
      duration: 1.2,
      ease: "power3.inOut",
    });

    gsap.to(this.details, {
      x: "-50vw",
      duration: 1.2,
      ease: "power3.inOut",
    });

    this.flipProduct(product);
  }
  public hideDetails(product: HTMLElement) {
    this.close.classList.remove("active");
    gsap.to(this.dom, {
      x: "0vw",
      duration: 1.2,
      ease: "power3.inOut",
    });
    gsap.to(this.close, {
      x: "0vw",
      duration: 1.2,
      ease: "power3.inOut",
    });
    gsap.to(this.details, {
      x: "0vw",
      duration: 1.2,
      ease: "power3.inOut",
    });
    const state = Flip.getState(product);
    if (this.originalParent) {
      this.originalParent.appendChild(product);
    }
    Flip.from(state, {
      absolute: true,
      duration: 1.2,
      ease: "power3.inOut",
    });

    this.currentProduct = null;
    this.originalParent = null;
  }
  public flipProduct(product: HTMLElement) {
    this.currentProduct = product;
    this.originalParent = product.parentNode as HTMLElement;

    // if (this.observer) {
    //   this.observer.unobserve(product);
    // }

    const state = Flip.getState(product);
    this.detailsThumb.appendChild(product);

    Flip.from(state, {
      absolute: true,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        this.movingFlag = false;
      },
    });
  }
  public unFlipProduct() {
    if (this.movingFlag) return;
    this.movingFlag = true;
    if (!this.currentProduct || !this.originalParent) return;

    this.close.classList.remove("active");
    gsap.to(this.dom, {
      x: "0vw",
      duration: 1.2,
      ease: "power3.inOut",
    });
    gsap.to(this.close, {
      x: "0vw",
      duration: 1.2,
      ease: "power3.inOut",
    });
    gsap.to(this.details, {
      x: "0vw",
      duration: 1.2,
      ease: "power3.inOut",
    });
    // gsap.to(this.cross, {
    //   scale: 0,
    //   duration: 0.4,
    //   ease: "power2.out"
    // })
    const finalRect = this.originalParent.getBoundingClientRect();
    const currentRect = this.currentProduct.getBoundingClientRect();
    gsap.set(this.currentProduct, {
      position: "absolute",
      top:
        currentRect.top - this.detailsThumb.getBoundingClientRect().top + "px",
      left:
        currentRect.left -
        this.detailsThumb.getBoundingClientRect().left +
        "px",
      width: currentRect.width + "px",
      height: currentRect.height + "px",
      zIndex: 10000,
    });

    gsap.to(this.currentProduct, {
      top: finalRect.top - this.detailsThumb.getBoundingClientRect().top + "px",
      left:
        finalRect.left - this.detailsThumb.getBoundingClientRect().left + "px",
      width: finalRect.width + "px",
      height: finalRect.height + "px",
      duration: 1.2,
      delay: 0,
      ease: "power3.inOut",
      onComplete: () => {
        if (!this.currentProduct || !this.originalParent) return;
        this.originalParent.appendChild(this.currentProduct);

        gsap.set(this.currentProduct, {
          position: "",
          top: "",
          left: "",
          width: "",
          height: "",
          zIndex: "",
        });

        this.currentProduct = null;
        this.originalParent = null;

        this.movingFlag = false;
      },
    });
  }
  public setMouseTrack() {
    const close = document.querySelector("#close") as HTMLDivElement;
    const pointerX = motionValue(0);
    const pointerY = motionValue(0);
    const x = springValue(pointerX, { stiffness: 50, duration: 0.1 });
    const y = springValue(pointerY, { stiffness: 50, duration: 0.1 });
    let rect = close.getBoundingClientRect();
    close.addEventListener("pointermove", (e) => {
      rect = close.getBoundingClientRect();
      pointerX.set(e.clientX - rect.left);
      pointerY.set(e.clientY);
    });
    styleEffect("#cross", { x, y });
  }
}
