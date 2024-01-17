import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  // addBasePlugins
} from "webgi";
import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas") as HTMLCanvasElement,
    useRgbm: false,
  });

  const manager = await viewer.addPlugin(AssetManagerPlugin);
  const camera = viewer.scene.activeCamera;
  const position = camera.position;
  const target = camera.target;

  // Add plugins individually.
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm));
  await viewer.addPlugin(SSRPlugin);
  await viewer.addPlugin(SSAOPlugin);
  await viewer.addPlugin(BloomPlugin);

  viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true;

  viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });

  viewer.renderer.refreshPipeline();

  await manager.addFromPath("./assets/drill3.glb");

  function setupScrollAnimation() {
    const tl = gsap.timeline();

    //First Section

    tl.to(position, {
      x: 1.56,
      y: -2.26,
      z: -3.85,
      scrollTrigger: {
        trigger: ".second",
        start: "top bottom",
        end: "top top",
        scrub: true,
        immediateRender: false,
      },
      onUpdate,
    })

      .to(".section--one--container", {
        xPercent: "-150",
        opacity: 0,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top 80%",
          scrub: 1,
          immediateRender: false,
        },
      })
      .to(target, {
        x: -1.37,
        y: 1.99,
        z: -0.37,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      })

      // LAST SECTION

      .to(position, {
        x: -3.4,
        y: 9.6,
        z: 1.71,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      })

      .to(target, {
        x: -1.5,
        y: 2.13,
        z: -0.4,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      });
  }

  setupScrollAnimation();

  // WEBGI UPDATE
  let needsUpdate = true;

  function onUpdate() {
    needsUpdate = true;
    // viewer.renderer.resetShadows()
    viewer.setDirty();
  }

  viewer.addEventListener("preFrame", () => {
    if (needsUpdate) {
      camera.positionTargetUpdated(true);
      needsUpdate = false;
    }
  });
}

setupViewer();
