const bs = {
  start: "start",
  reset: "reset",
};
const rs = {
  counter: "counter",
  reset: "reset",
};
const INIT_COUNTER = 10;
const COUNTER_INTERVAL = 10;
var counter = INIT_COUNTER;
var counterInterval;
var buzzInterval;
var buttonNext = bs.start;
var renderNext = rs.counter;

function buttonHandler() {
  console.log("buttonHandler: ", buttonNext, renderNext);

  switch (buttonNext) {
    case bs.start: {
      startTimer();
      render();
      return;
    }
    case bs.reset: {
      buttonNext = bs.start;
      renderNext = rs.counter;
      if (buzzInterval) clearInterval(buzzInterval);
      render();
      return;
    }
  }
}

function randomColor() {
  var random = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  while (random.length < 7) {
    random += "0";
  }
  return random;
}

function countDown() {
  if (counter <= 0) {
    if (counterInterval) {
      clearInterval(counterInterval);
      counterInterval = undefined;
    }
    buttonNext = bs.reset;
    renderNext = rs.reset;
    counter = INIT_COUNTER;
    Bangle.buzz();
    buzzInterval = setInterval(() => Bangle.buzz(), 5000);
    render();
    return;
  }

  counter--;

  render();
}

function startTimer() {
  countDown();
  // if we had an interval before, clear it
  if (counterInterval) clearInterval(counterInterval);
  // call countDown every second
  counterInterval = setInterval(countDown, 1000);
}

function render() {
  console.log("render: ", buttonNext, renderNext, counter);
  g.clear(1);
  switch (renderNext) {
    case rs.counter: {
      g.setFontAlign(0, 0)
        .setFont("6x8:4")
        .drawString("+", g.getWidth() / 2, 32);
      g.setFontAlign(0, 0)
        .setFont("6x8:8")
        .drawString(counter, g.getWidth() / 2, g.getHeight() / 2);
      g.setFontAlign(0, 0)
        .setFont("6x8:4")
        .drawString("-", g.getWidth() / 2, g.getHeight() - 32);
      return;
    }
    case rs.reset: {
      renderNext = rs.counter;
      E.showMessage("Time is up!", "Timy Timy");
      return;
    }
    default:
      E.showMessage("Click to start", "Timy Timer");
  }
  return;
}

Bangle.on("touch", function (button, xy) {
  if (bs.start) {
    if (xy.y < 32) {
      counter += COUNTER_INTERVAL;
    }
    if (xy.y >= g.getHeight() - 32) {
      counter -= COUNTER_INTERVAL;
    }
  }

  if (bs.reset) {
    if (buzzInterval) {
      clearInterval(buzzInterval);
      buttonNext = bs.start;
    }
  }

  render();
});

Bangle.setUI({
  mode: "custom",
  btn: buttonHandler,
});

// initial render
render();
