//Matter needs two seperate things:
//1. an engine (the computation and math)
//2. a renderer (this draws the engine)

//aliases (shortcuts to make code cleaner)
//deconstructed const's
const {Engine, Render, Bodies, World, MouseConstraint, Composites} = Matter;

//where on the page is Matter being deployed?
const sectionTag = document.querySelector('section.shapes');

//width and height of the page
const w = window.innerWidth;
const h = window.innerHeight;

const engine = Engine.create();
const renderer = Render.create({
  element: sectionTag,
  engine: engine,
  options: {
    height: h,
    width: w,
    background: '#000',
    wireframes: false,
    pixelRatio: window.devicePixelRatio
  }
});

//create shapes:
const createShape = (x, y) => {
  return Bodies.rectangle(x, y, 38, 50, {
    //add air friction effect
    frictionAir: 0.07,
    render: {
      sprite: {
        //add image
        texture: 'outline-2x.png',
        //retina display
        xScale: 0.5,
        yScale: 0.5
      }
    }
  });
};

//create 'bigBall' in center of page
const bigBall = Bodies.circle(w / 2, h / 2, 250, {
  isStatic: true,
  render: {
    fillStyle: '#fff'
  }
});

const wallOptions = {
  isStatic: true,
  render: {
    visible: false
  }
};

//add 'walls' to page
const ground = Bodies.rectangle(w / 2, h + 50, w + 100, 100, wallOptions);
const ceiling = Bodies.rectangle(w / 2, -50, w + 100, 100, wallOptions);
const leftWall = Bodies.rectangle(-50, h / 2, 100, h + 100, wallOptions);
const rightWall = Bodies.rectangle(w + 50, h / 2, 100, h + 100, wallOptions);

const mouseControl = MouseConstraint.create(engine, {
  element: sectionTag,
  constraint: {
    render: {
      visible: false
    }
  }
});

const initialShapes = Composites.stack(50, 50, 15, 5, 40, 40, function(x, y) {
  return createShape(x, y);
});

//add shapes to page
World.add(engine.world, [
  bigBall,
  ground,
  ceiling,
  leftWall,
  rightWall,
  mouseControl,
  initialShapes
]);

//when page is clicked, add a new shape
document.addEventListener('click', event => {
  const shape = createShape(event.pageX, event.pageY);
  World.add(engine.world, shape);
});

//run the engine and renderer
Engine.run(engine);
Render.run(renderer);
