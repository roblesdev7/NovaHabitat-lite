const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 2500);
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Error inesperado');
  }
  return data;
}

function propertyCard(property) {
  return `
    <div class="item">
      <div><strong>${property.title}</strong> (${property.id})</div>
      <div>${property.location}</div>
      <div>USD ${property.price} • Estado: ${property.status}</div>
      <small>Auditoría cambios: ${property.statusHistory.length}</small>
      <div class="row">
        <select id="prop-status-${property.id}">
          <option ${property.status === 'Available' ? 'selected' : ''}>Available</option>
          <option ${property.status === 'Reserved' ? 'selected' : ''}>Reserved</option>
          <option ${property.status === 'Rented' ? 'selected' : ''}>Rented</option>
          <option ${property.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
        </select>
        <button onclick="changePropertyStatus('${property.id}')">Cambiar estado</button>
      </div>
    </div>
  `;
}

function leadCard(lead) {
  return `
    <div class="item">
      <div><strong>${lead.name}</strong> (${lead.id})</div>
      <div>Canal: ${lead.channel} • Estado: ${lead.status}</div>
      <div>Presupuesto: USD ${lead.budget}</div>
      <small>Interacciones: ${lead.interactions.length} • Auditoría cambios: ${lead.statusHistory.length}</small>
      <div class="row">
        <select id="lead-status-${lead.id}">
          <option ${lead.status === 'New' ? 'selected' : ''}>New</option>
          <option ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
          <option ${lead.status === 'Closed' ? 'selected' : ''}>Closed</option>
          <option ${lead.status === 'Lost' ? 'selected' : ''}>Lost</option>
        </select>
        <button onclick="changeLeadStatus('${lead.id}')">Cambiar estado</button>
      </div>
      <div class="row">
        <input id="lead-note-${lead.id}" placeholder="Nota de interacción" />
        <button onclick="addInteraction('${lead.id}')">Agregar nota</button>
      </div>
    </div>
  `;
}

async function loadProperties(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.append(key, value);
  });
  const list = await api(`/properties?${params.toString()}`);
  document.getElementById('properties-list').innerHTML = list.map(propertyCard).join('') || '<small>Sin resultados</small>';
}

async function loadLeads(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.append(key, value);
  });
  const list = await api(`/leads?${params.toString()}`);
  document.getElementById('leads-list').innerHTML = list.map(leadCard).join('') || '<small>Sin resultados</small>';
}

async function changePropertyStatus(id) {
  const status = document.getElementById(`prop-status-${id}`).value;
  try {
    await api(`/properties/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, changedBy: 'ui-user', reason: 'Cambio desde UI' }),
    });
    showToast('Estado de propiedad actualizado');
    loadProperties();
  } catch (error) {
    showToast(error.message);
  }
}

async function changeLeadStatus(id) {
  const status = document.getElementById(`lead-status-${id}`).value;
  try {
    await api(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, changedBy: 'ui-user', reason: 'Cambio desde UI' }),
    });
    showToast('Estado de lead actualizado');
    loadLeads();
  } catch (error) {
    showToast(error.message);
  }
}

async function addInteraction(id) {
  const content = document.getElementById(`lead-note-${id}`).value;
  try {
    await api(`/leads/${id}/interactions`, {
      method: 'POST',
      body: JSON.stringify({ type: 'NOTE', content }),
    });
    showToast('Interacción registrada');
    loadLeads();
  } catch (error) {
    showToast(error.message);
  }
}

document.getElementById('property-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;
  try {
    await api('/properties', {
      method: 'POST',
      body: JSON.stringify({
        title: form.title.value,
        location: form.location.value,
        price: Number(form.price.value),
        status: form.status.value,
      }),
    });
    form.reset();
    showToast('Propiedad creada');
    loadProperties();
  } catch (error) {
    showToast(error.message);
  }
});

document.getElementById('property-filter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  loadProperties({
    status: form.status.value,
    locationKeyword: form.locationKeyword.value,
  });
});

document.getElementById('property-refresh').addEventListener('click', () => loadProperties());

document.getElementById('lead-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;
  try {
    await api('/leads', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name.value,
        channel: form.channel.value,
        criteria: form.criteria.value,
        budget: Number(form.budget.value),
      }),
    });
    form.reset();
    showToast('Lead creado');
    loadLeads();
  } catch (error) {
    showToast(error.message);
  }
});

document.getElementById('lead-filter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  loadLeads({
    channel: form.channel.value,
    status: form.status.value,
  });
});

document.getElementById('lead-refresh').addEventListener('click', () => loadLeads());

loadProperties();
loadLeads();
window.changePropertyStatus = changePropertyStatus;
window.changeLeadStatus = changeLeadStatus;
window.addInteraction = addInteraction;
