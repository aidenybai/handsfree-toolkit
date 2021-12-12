import {
  div,
  button,
  init,
  element,
  details,
  summary,
  section,
  h4,
  input,
  label,
  span,
} from 'hacky';
import Handsfree from 'handsfree';
import 'handsfree/build/lib/assets/handsfree.css';
import 'https://leomcelroy.com/widgets/code-mirror.js';
import 'water.css/out/light.css';

const codemirror = element('code-mirror');
const config = {
  models: {
    hands: {
      enabled: false,
      maxNumHands: 4,
      minDetectionConfidence: 0.4,
      minTrackingConfidence: 0.4,
    },
    handpose: {
      enabled: false,
      backend: 'webgl',
      maxContinuousChecks: Infinity,
      detectionConfidence: 0.75,
      iouThreshold: 0.3,
      scoreThreshold: 0.75,
    },
    facemesh: {
      enabled: false,
      maxNumFaces: 4,
      minDetectionConfidence: 0.4,
      minTrackingConfidence: 0.4,
    },
    pose: {
      enabled: false,
      smoothLandmarks: true,
      minDetectionConfidence: 0.4,
      minTrackingConfidence: 0.4,
    },
  },
};

const App = init(() =>
  section([
    h4(['handsfree-toolkit']),
    details({ open: true }, [
      summary(['Config']),
      span([
        input({
          type: 'checkbox',
          name: 'hands',
          onchange: () =>
            (config.models.hands.enabled = !config.models.hands.enabled),
        }),
        label({ for: 'hands' }, ['Hands (2D)']),
      ]),
      span([
        input({
          type: 'checkbox',
          name: 'handpose',
          onchange: () =>
            (config.models.handpose.enabled = !config.models.handpose.enabled),
        }),
        label({ for: 'handpose' }, ['Handpose (3D)']),
      ]),
      span([
        input({
          type: 'checkbox',
          name: 'facemesh',
          onchange: () =>
            (config.models.facemesh.enabled = !config.models.facemesh.enabled),
        }),
        label({ for: 'facemesh' }, ['Face']),
      ]),
      span([
        input({
          type: 'checkbox',
          name: 'pose',
          onchange: () =>
            (config.models.pose.enabled = !config.models.pose.enabled),
        }),
        label({ for: 'pose' }, ['Pose']),
      ]),
    ]),
    button(
      {
        className: 'hc-button',
        onclick: () => {
          const code = document.getElementById('cm').view.state.doc.toString();
          const handsfree = new Handsfree(config.models);
          handsfree.enablePlugins('browser');
          console.log(handsfree);
          const globals = { handsfree };
          new Function(
            ...Object.keys(globals),
            `
            document.addEventListener('handsfree-data', ({ detail }) => {
              ${
                config.models.hands.enabled
                  ? 'const hands = () => detail.hands.multiHandLandmarks;'
                  : ''
              }
              ${
                config.models.handpose.enabled
                  ? 'const handpose = () => detail.handpose.annotations;'
                  : ''
              }
              ${
                config.models.facemesh.enabled
                  ? 'const facemesh = () => detail.facemesh.multiFaceLandmarks;'
                  : ''
              }
              ${
                config.models.pose.enabled
                  ? 'const pose = () => detail.pose.poseLandmarks;'
                  : ''
              }
              ${code}
            });`
          )(...Object.values(globals));
          handsfree.start();
        },
      },
      ['Run']
    ),
    codemirror({
      id: 'cm',
      className: 'CodeMirror cm-s-3024-night',
    }),
  ])
);

document.body.appendChild(App());
