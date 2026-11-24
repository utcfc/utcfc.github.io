/* Pop III SFRD viewer: reads a byte-identical embedded copy of the original CSV files. */
(() => {
  'use strict';

  const models = [
  {
    "id": "tornatore07",
    "label": "Tornatore et al. (2007)",
    "filename": "SFRD_popIII_Tornatore+07_10Mpc.csv",
    "color": "#e39b15",
    "dash": "solid",
    "defaultOn": true
  },
  {
    "id": "trenti09",
    "label": "Trenti & Stiavelli (2009)",
    "filename": "SFRD_popIII_Trenti&Stiavelli09_ref_tot.csv",
    "color": "#8b9e26",
    "dash": "dot",
    "defaultOn": true
  },
  {
    "id": "maio10",
    "label": "Maio et al. (2010)",
    "filename": "SFRD_popIII_Maio+10_ref.csv",
    "color": "#0f8392",
    "dash": "dashdot",
    "defaultOn": true
  },
  {
    "id": "johnson13",
    "label": "Johnson et al. (2013)",
    "filename": "SFRD_popIII_Johnson+13_FiBY+LW.csv",
    "color": "#364c98",
    "dash": "dash",
    "defaultOn": true
  },
  {
    "id": "pallottini14",
    "label": "Pallottini et al. (2014)",
    "filename": "SFRD_popIII_Pallottini+14.csv",
    "color": "#88858a",
    "dash": "dot",
    "defaultOn": true
  },
  {
    "id": "xu16",
    "label": "Xu et al. (2016)",
    "filename": "SFRD_popIII_Xu+16_Renaissance_Normal.csv",
    "color": "#dbac04",
    "dash": "solid",
    "defaultOn": true
  },
  {
    "id": "sarmento18",
    "label": "Sarmento et al. (2018)",
    "filename": "SFRD_popIII_Sarmento+18.csv",
    "color": "#222222",
    "dash": "dash",
    "defaultOn": true
  },
  {
    "id": "jaacks19",
    "label": "Jaacks et al. (2019)",
    "filename": "SFRD_popIII_Jaacks+19.csv",
    "color": "#9c3bc9",
    "dash": "dot",
    "defaultOn": true
  },
  {
    "id": "liu20",
    "label": "Liu & Bromm (2020)",
    "filename": "SFRD_popIII_Liu&Bromm20.csv",
    "color": "#e52eb0",
    "dash": "solid",
    "defaultOn": true
  },
  {
    "id": "skinner20",
    "label": "Skinner & Wise (2020)",
    "filename": "SFRD_popIII_Skinner&Wise20.csv",
    "color": "#e66d53",
    "dash": "dashdot",
    "defaultOn": true
  },
  {
    "id": "visbal20",
    "label": "Visbal et al. (2020)",
    "filename": "SFRD_popIII_Visbal+20.csv",
    "color": "#298a40",
    "dash": "dash",
    "defaultOn": true
  },
  {
    "id": "venditti23",
    "label": "Venditti et al. (2023)",
    "filename": "SFRD_popIII_Venditti+23_dustyGadget_10Myr.csv",
    "color": "#b2319c",
    "dash": "dot",
    "defaultOn": true
  },
  {
    "id": "trinca24",
    "label": "Trinca et al. (2024)",
    "filename": "SFRD_popIII_Trinca+24_CAT.csv",
    "color": "#5aaa62",
    "dash": "solid",
    "defaultOn": true
  },
  {
    "id": "ventura24",
    "label": "Ventura et al. (2024)",
    "filename": "SFRD_popIII_Ventura+24_Meraxes.csv",
    "color": "#ad5b22",
    "dash": "solid",
    "defaultOn": true
  },
  {
    "id": "cruz25",
    "label": "Cruz et al. (2025)",
    "filename": "SFRD_popIII_Cruz+25_Zeus21.csv",
    "color": "#d17798",
    "dash": "dot",
    "defaultOn": true
  },
  {
    "id": "hegde25",
    "label": "Hegde & Furlanetto (2025)",
    "filename": "SFRD_popIII_Hegde&Furlanetto25_abcd.csv",
    "color": "#b08412",
    "dash": "dash",
    "defaultOn": true
  },
  {
    "id": "sarmento25",
    "label": "Sarmento & Scannapieco (2025)",
    "filename": "SFRD_popIII_Sarmento&Scannapieco25_RT.csv",
    "color": "#8d973b",
    "dash": "solid",
    "defaultOn": true
  },
  {
    "id": "samuel26",
    "label": "Samuel et al. (2026)",
    "filename": "SFRD_popIII_Samuel+26_CampFIRE-6k.csv",
    "color": "#c32e4a",
    "dash": "dashdot",
    "defaultOn": true
  }
];
  const observations = [
    {id:'fujimoto2025', label:'Fujimoto et al. (2025)', kind:'rectangle',
     zMin:5.6, zMax:6.6, yMin:-6.29, yMax:-3.98,
     zRange:'5.6 ≲ z ≲ 6.6'},

    {id:'cassata2013', label:'Cassata et al. (2013)', kind:'point', symbol:'circle', 
     z:3.3, zErr:1.3, y:-6.0,
     zRange:'2 ≲ z ≲ 4.6'
},

    {id:'nagao2008', label:'Nagao et al. (2008)', kind:'point', symbol:'triangle-down', 
     z:4.3, zErr:0.3, y:Math.log10(5e-6),
     upperLimit:true,
     zRange:'4 ≲ z ≲ 4.6'},

    {id:'mirzakhanlari2026', label:'Mirza Khanlari et al. (2026)', kind:'point', symbol:'diamond',
     z:2.1, zErr:0.2, y:Math.log10(6e-9), 
     zRange:'1.9 ≲ z ≲ 2.3'}
  ];

  function decodeModelCSV(raw) {
    // Files have a .csv extension but are whitespace-delimited; only columns 0–2 are plotted.
    // Raw file bytes are preserved for downloads, including the source header and extra columns.
    const text = new TextDecoder('utf-8').decode(raw);
    const points = [];
    for (const line of text.split(/\r?\n/)) {
      const value = line.trim();
      if (!value || value.startsWith('#')) continue;
      const fields = value.split(/\s+/);
      if (fields.length < 3) throw new Error('Fewer than three data columns');
      const z = Number(fields[0]);
      const sfrd = Number(fields[1]);
      const logSfrd = Number(fields[2]);
      if (!Number.isFinite(z) || !Number.isFinite(sfrd)) throw new Error('Invalid redshift or SFRD');
      points.push([z, Number.isFinite(logSfrd) ? logSfrd : null, sfrd]);
    }
    if (!points.length) throw new Error('Empty model CSV');
    points.sort((a,b) => a[0] - b[0]); // display order only; original CSV bytes stay unchanged
    return points;
  }

  // Minimal standards-compliant ZIP writer (uncompressed, CRC32): no server or ZIP library.
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    crcTable[n] = c >>> 0;
  }
  function crc32(bytes) {
    let c = 0xffffffff;
    for (const b of bytes) c = (c >>> 8) ^ crcTable[(c ^ b) & 255];
    return (c ^ 0xffffffff) >>> 0;
  }
  function makeZip(selected) {
    const encoder = new TextEncoder();
    const local = [], central = [];
    let offset = 0, centralSize = 0;
    for (const m of selected) {
      const name = encoder.encode(m.filename), bytes = m.raw;
      const check = crc32(bytes);
      const localHeader = new Uint8Array(30 + name.length);
      let dv = new DataView(localHeader.buffer);
      dv.setUint32(0, 0x04034b50, true); dv.setUint16(4, 20, true);
      dv.setUint32(14, check, true);
      dv.setUint32(18, bytes.length, true); dv.setUint32(22, bytes.length, true);
      dv.setUint16(26, name.length, true); localHeader.set(name, 30);
      local.push(localHeader, bytes);

      const entry = new Uint8Array(46 + name.length);
      dv = new DataView(entry.buffer);
      dv.setUint32(0, 0x02014b50, true);
      dv.setUint16(4, 20, true); dv.setUint16(6, 20, true);
      dv.setUint32(16, check, true);
      dv.setUint32(20, bytes.length, true); dv.setUint32(24, bytes.length, true);
      dv.setUint16(28, name.length, true);
      dv.setUint32(42, offset, true);
      entry.set(name, 46);
      central.push(entry);
      centralSize += entry.length;
      offset += localHeader.length + bytes.length;
    }
    const ending = new Uint8Array(22), dv = new DataView(ending.buffer);
    dv.setUint32(0, 0x06054b50, true);
    dv.setUint16(8, selected.length, true); dv.setUint16(10, selected.length, true);
    dv.setUint32(12, centralSize, true); dv.setUint32(16, offset, true);
    return new Blob([...local, ...central, ending], {type:'application/zip'});
  }

  function modelTrace(m, visible) {
    return {
      type:'scatter', mode:'lines', uid:`model-${m.id}`, name:m.label,
      x:m.points.map(p=>p[0]), y:m.points.map(p=>p[1]),
      customdata:m.points.map(p=>p[2]),
      line:{color:m.color, dash:m.dash, width:m.id==='trinca24'?1.2:2.05},
      opacity:m.id==='trinca24'?.68:.94, connectgaps:false, visible,
      hovertemplate:`<b>${m.label}</b><br>z = %{x:.2f}<br>log₁₀ SFRD = %{y:.3f}<br>SFRD = %{customdata:.3e} M☉ yr⁻¹ cMpc⁻³<extra></extra>`
    };
  }
  function observationTrace(o, visible) {
    if (o.kind === 'rectangle') return {
      type:'scatter', mode:'lines', uid:`observation-${o.id}`, showlegend:false,
      x:[o.zMin,o.zMax,o.zMax,o.zMin,o.zMin],
      y:[o.yMin,o.yMin,o.yMax,o.yMax,o.yMin],
      fill:'toself', fillcolor:'rgba(205,50,70,0.20)',
      line:{color:'rgba(172,44,64,0.45)',width:1},
      hoveron:'fills',
      hoverinfo:'text',
      text:
        `<b>${o.label}</b>` +
        `<br>${o.zRange || `${o.zMin} ≲ z ≲ ${o.zMax}`}` +
        `<br>log₁₀ SFRD ≃ ${o.yMin}–${o.yMax}`,
      visible
    };
    return {
      type:'scatter',mode:'markers',uid:`observation-${o.id}`,name:o.label,
      x: Array.isArray(o.z) ? o.z : [o.z],
      y: Array.isArray(o.z) ? o.z.map(() => o.y) : [o.y],
      visible,
      error_x:{
        type:'data',
        array: Array.isArray(o.zErr) ? o.zErr : [o.zErr],
        visible:true,
        color:'#a52c39',
        thickness:1.8,
        width:5
      },
      marker:{
        color:'#b9283d',
        size:10,
        symbol:o.symbol || 'circle'
        },
      hovertemplate:
        `<b>${o.label}</b>` +
        `<br>${o.zRange || `z ≈ ${o.z}`}` +
        `<br>log₁₀ SFRD ${o.upperLimit ? '≲' : '≈'} %{y:.3f}` +
        '<extra></extra>'
    };
  }
  const layout = {
    height:530,autosize:true,showlegend:false,margin:{l:79,r:17,t:22,b:66},
    font:{family:'inherit',size:12,color:'#27415d'},paper_bgcolor:'#fff',plot_bgcolor:'#fff',
    xaxis:{title:{text:'Redshift  z',standoff:13},range:[1.7,26],dtick:5,
      showline:true,mirror:true,linecolor:'#91a3b5',linewidth:1,showgrid:true,gridcolor:'#edf1f5',zeroline:false},
    yaxis:{title:{text:'log₁₀ [ SFRD / (M☉ yr⁻¹ cMpc⁻³) ]',standoff:12},range:[-9,-2],dtick:1,
      showline:true,mirror:true,linecolor:'#91a3b5',linewidth:1,showgrid:true,gridcolor:'#edf1f5',zeroline:false},
    uirevision:'retain-user-zoom',hovermode:'closest',dragmode:'zoom'
  };

  async function init() {
    const app = document.getElementById('popiii-sfrd-app');
    if (!app) return;
    const plot = app.querySelector('.sfrd-plot');
    const status = app.querySelector('.sfrd-download-status');
    const downloadButton = app.querySelector('[data-action="download-visible"]');
    if (!window.Plotly) { plot.textContent = 'Plotly is unavailable.'; return; }

    // The embedded byte arrays are generated directly from the published CSV files.
    // No fetch(): the figure and selected-model ZIP both work when opened with file://.
    try {
      const csvByName = window.POPIII_SFRD_CSV_BASE64;
      if (!csvByName) throw new Error('Missing models_data.js asset');
      for (const m of models) {
        const encoded = csvByName[m.filename];
        if (typeof encoded !== 'string') throw new Error(`Missing embedded CSV: ${m.filename}`);
        const binary = atob(encoded);
        m.raw = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) m.raw[i] = binary.charCodeAt(i);
        m.points = decodeModelCSV(m.raw);
      }
    } catch (error) {
      console.error(error);
      plot.textContent = `Could not load the embedded model CSV files: ${error.message}`;
      return;
    }

    const selectedModels = new Set(models.filter(m=>m.defaultOn).map(m=>m.id));
    const selectedObservations = new Set(observations.map(o=>o.id));
    const modelInputs = new Map(), observationInputs = new Map();
    const modelCount = app.querySelector('.sfrd-count');
    const observationCount = app.querySelector('.sfrd-observation-count');
    const modelPanel = app.querySelector('.sfrd-model-grid');
    const observationPanel = app.querySelector('.sfrd-observation-grid');

    function checkbox(item, group, parent, inputs) {
      const label = document.createElement('label');
      label.className = 'sfrd-model-label';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = group.has(item.id);
      input.setAttribute('aria-label', item.label);
      input.addEventListener('change', () => {
        if (input.checked) group.add(item.id); else group.delete(item.id);
        draw();
      });
      const swatch = document.createElement('span');
      swatch.className = 'sfrd-swatch';
      swatch.style.color = item.color || '#b9283d';

      if (item.kind === 'point') {
        const glyphs = {circle:'●', diamond:'◆', 'triangle-down':'▼'};
        swatch.textContent = glyphs[item.symbol] || '●';

      } else if (item.kind === 'rectangle') {
        swatch.textContent = '▭';

      } else {
        const dash = {solid:'solid', dash:'dashed', dot:'dotted'};
        if (item.dash === 'dashdot') {
          swatch.style.background =
            'repeating-linear-gradient(to right, currentColor 0 9px, transparent 9px 13px, currentColor 13px 15px, transparent 15px 20px)';
          swatch.style.height = '3px';
        } else {
          swatch.style.borderTop =
            `3px ${dash[item.dash] || 'solid'} currentColor`;
        }
      }
      const title = document.createElement('span'); title.className='sfrd-model-name'; title.textContent=item.label;
      label.append(input,swatch,title);
      parent.append(label); inputs.set(item.id,{label,input});
    }
    for (const m of models) checkbox(m,selectedModels,modelPanel,modelInputs);
    for (const o of observations) checkbox(o,selectedObservations,observationPanel,observationInputs);

    function draw() {
      for (const m of models) modelInputs.get(m.id).input.checked=selectedModels.has(m.id);
      for (const o of observations) observationInputs.get(o.id).input.checked=selectedObservations.has(o.id);
      modelCount.textContent=`${selectedModels.size} / ${models.length} visible`;
      observationCount.textContent=`${selectedObservations.size} / ${observations.length} visible`;
      downloadButton.disabled = selectedModels.size === 0;
      const traces = [
        ...observations.filter(o=>o.kind==='rectangle').map(o=>observationTrace(o,selectedObservations.has(o.id))),
        ...models.map(m=>modelTrace(m,selectedModels.has(m.id))),
        ...observations.filter(o=>o.kind==='point').map(o=>observationTrace(o,selectedObservations.has(o.id)))
      ];
      window.Plotly.react(plot,traces,layout,{
        responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d'],
        toImageButtonOptions:{format:'png',filename:'population_III_SFRD_comparison',height:850,width:1280,scale:1.5}
      }).catch(error => {console.error(error);plot.textContent='The figure could not be rendered.';});
    }
    function choose(group, ids) {group.clear(); ids.forEach(id=>group.add(id)); draw();}
    app.querySelector('[data-action="models-all"]').addEventListener('click',()=>choose(selectedModels,models.map(m=>m.id)));
    app.querySelector('[data-action="models-none"]').addEventListener('click',()=>choose(selectedModels,[]));
    app.querySelector('[data-action="observations-all"]').addEventListener('click',()=>choose(selectedObservations,observations.map(o=>o.id)));
    app.querySelector('[data-action="observations-none"]').addEventListener('click',()=>choose(selectedObservations,[]));
    app.querySelector('#sfrd-search').addEventListener('input',event=>{
      const needle = event.target.value.trim().toLocaleLowerCase();
      for (const m of models) modelInputs.get(m.id).label.hidden = !m.label.toLocaleLowerCase().includes(needle);
    });

    downloadButton.addEventListener('click',()=>{
      const chosen = models.filter(m=>selectedModels.has(m.id));
      if (!chosen.length) return;
      const blob=makeZip(chosen);
      const url=URL.createObjectURL(blob);
      const link=document.createElement('a');
      link.href=url;link.download='popiii_sfrd_selected_models.zip';
      document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),10000);
      status.textContent=`ZIP containing ${chosen.length} unchanged source CSV ${chosen.length===1?'file':'files'}.`;
    });
    draw();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
