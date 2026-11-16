const samples = [
  { id: 'S1', sequence: 'ATGCGATC', group: 'A' },
  { id: 'S2', sequence: 'ATGCGTAC', group: 'A' },
  { id: 'S3', sequence: 'GCGCGTAT', group: 'B' },
  { id: 'S4', sequence: 'GCGCGCGC', group: 'B' }
];

const $ = (id) => document.getElementById(id);
const input = $('sequenceInput');
let toastTimer;

function features(sequence) {
  const s = sequence.toUpperCase();
  const A = (s.match(/A/g) || []).length;
  const T = (s.match(/T/g) || []).length;
  const G = (s.match(/G/g) || []).length;
  const C = (s.match(/C/g) || []).length;
  return { A, T, G, C, length: s.length, gc: s.length ? ((G + C) / s.length) * 100 : 0 };
}

function validSequence(value) {
  return value.length > 0 && /^[ATGC]+$/i.test(value.trim());
}

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function renderDataset() {
  $('datasetBody').innerHTML = samples.map((sample) => {
    const f = features(sample.sequence);
    return `<tr>
      <td>${sample.id}</td>
      <td class="sequence-code">${sample.sequence}</td>
      <td>${f.length} bp</td>
      <td>${f.gc.toFixed(1)}%</td>
      <td><span class="group-pill ${sample.group.toLowerCase()}">GROUP ${sample.group}</span></td>
      <td><button class="row-action" data-load="${sample.sequence}">Load ↗</button></td>
    </tr>`;
  }).join('');
  $('sequenceCount').textContent = String(samples.length).padStart(2, '0');
}

function renderFeatures(f) {
  ['A', 'T', 'G', 'C'].forEach((base) => {
    $(`feature${base}`).textContent = f[base];
    const percentage = f.length ? (f[base] / f.length) * 100 : 0;
    $(`bar${base}`).style.width = `${percentage}%`;
    $(`comp${base}`).style.width = `${percentage}%`;
    $(`chart${base}`).style.height = `${percentage}%`;
  });
  $('featureLength').innerHTML = `${f.length} <small>bp</small>`;
  $('featureGC').innerHTML = `${f.gc.toFixed(1)} <small>%</small>`;
  $('compositionText').textContent = `${f.length} total bases`;
}

function resetResults() {
  ['A', 'T', 'G', 'C'].forEach((base) => {
    $(`feature${base}`).textContent = '—';
    $(`bar${base}`).style.width = '0%';
    $(`comp${base}`).style.width = '0%';
    $(`chart${base}`).style.height = '0%';
  });
  $('featureLength').innerHTML = '— <small>bp</small>';
  $('featureGC').innerHTML = '— <small>%</small>';
  $('compositionText').textContent = 'Waiting for sequence';
  $('resultBadge').textContent = 'AWAITING INPUT';
  $('resultBadge').classList.remove('ready');
  $('predictionOrb').textContent = '?';
  $('predictionOrb').classList.remove('group-b');
  $('predictionGroup').textContent = '—';
  $('predictionDescription').textContent = 'Analyze a valid DNA sequence to see the model output.';
  $('ruleOutput').textContent = 'Not evaluated';
}

function predict(f) {
  // Transparent one-split decision-tree demonstration based on the supplied examples.
  // Group A examples have 50% GC; Group B examples have at least 62.5% GC.
  return f.gc >= 56.25 ? 'B' : 'A';
}

function analyze() {
  const sequence = input.value.toUpperCase().replace(/\s/g, '');
  input.value = sequence;
  $('charCount').textContent = `${sequence.length} BASES`;

  if (!validSequence(sequence)) {
    $('inputStatus').textContent = '● INVALID — USE A, T, G, C';
    $('inputStatus').classList.add('invalid');
    resetResults();
    showToast('Enter a DNA sequence using only A, T, G and C.');
    return;
  }

  $('inputStatus').textContent = '● VALID SEQUENCE';
  $('inputStatus').classList.remove('invalid');
  const f = features(sequence);
  const group = predict(f);
  renderFeatures(f);

  $('resultBadge').textContent = 'ANALYSIS COMPLETE';
  $('resultBadge').classList.add('ready');
  $('predictionOrb').textContent = group;
  $('predictionOrb').classList.toggle('group-b', group === 'B');
  $('predictionGroup').textContent = `Group ${group}`;
  $('predictionDescription').textContent = group === 'B'
    ? 'The GC-content split places this sequence with Group B in this small example.'
    : 'The GC-content split places this sequence with Group A in this small example.';
  $('ruleOutput').textContent = `${f.gc.toFixed(1)}% ${f.gc >= 56.25 ? '≥' : '<'} 56.25%`;
  showToast(`Analysis complete — predicted Group ${group}.`);
}

input.addEventListener('input', () => {
  $('charCount').textContent = `${input.value.replace(/\s/g, '').length} BASES`;
  if (!input.value.trim()) {
    $('inputStatus').textContent = '● WAITING FOR INPUT';
    $('inputStatus').classList.remove('invalid');
    resetResults();
  }
});

$('analyzeButton').addEventListener('click', analyze);

$('clearButton').addEventListener('click', () => {
  input.value = '';
  $('charCount').textContent = '0 BASES';
  $('inputStatus').textContent = '● WAITING FOR INPUT';
  $('inputStatus').classList.remove('invalid');
  resetResults();
  showToast('Sequence input cleared.');
});

document.querySelectorAll('.sample-chip').forEach((button) => {
  button.addEventListener('click', () => {
    input.value = button.dataset.sequence;
    analyze();
  });
});

$('datasetBody').addEventListener('click', (event) => {
  const button = event.target.closest('[data-load]');
  if (!button) return;
  input.value = button.dataset.load;
  analyze();
  $('workspace').scrollIntoView({ behavior: 'smooth' });
});

$('downloadCsv').addEventListener('click', () => {
  const header = 'Sequence ID,DNA Sequence,A count,T count,G count,C count,Length,GC content (%),Group';
  const rows = samples.map((sample) => {
    const f = features(sample.sequence);
    return [sample.id, sample.sequence, f.A, f.T, f.G, f.C, f.length, f.gc.toFixed(1), sample.group].join(',');
  });
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'helixnova-sequence-feature-table.csv';
  link.click();
  URL.revokeObjectURL(url);
  showToast('Feature table exported as CSV.');
});

$('themeButton').addEventListener('click', () => {
  document.body.classList.toggle('light');
  showToast(document.body.classList.contains('light') ? 'Light appearance enabled.' : 'Dark appearance enabled.');
});

renderDataset();
analyze();
