(() => {
  const API_URL = "https://provinces.open-api.vn/api/?depth=3";
  const CACHE_KEY = "vn_address_v1_depth3";
  const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

  let cached = null;
  let loadingPromise = null;

  const now = () => Date.now();

  const safeParseJson = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  const readCache = () => {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = safeParseJson(raw);
    if (!parsed || !parsed.data || !parsed.ts) return null;
    if (now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  };

  const writeCache = (data) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: now(), data }));
    } catch {
      // ignore
    }
  };

  const normalize = (data) => {
    if (!Array.isArray(data)) return [];
    return data
      .filter((p) => p && p.code != null && p.name)
      .map((p) => ({
        code: String(p.code),
        name: String(p.name),
        districts: Array.isArray(p.districts)
          ? p.districts
              .filter((d) => d && d.code != null && d.name)
              .map((d) => ({
                code: String(d.code),
                name: String(d.name),
                wards: Array.isArray(d.wards)
                  ? d.wards
                      .filter((w) => w && w.code != null && w.name)
                      .map((w) => ({ code: String(w.code), name: String(w.name) }))
                  : [],
              }))
          : [],
      }));
  };

  const load = async () => {
    if (cached) return cached;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
      const cachedData = readCache();
      if (cachedData) {
        cached = normalize(cachedData);
        return cached;
      }

      const res = await fetch(API_URL, { method: "GET" });
      if (!res.ok) throw new Error(`Address API error: ${res.status}`);
      const data = normalize(await res.json());
      cached = data;
      writeCache(data);
      return cached;
    })()
      .catch((err) => {
        loadingPromise = null;
        throw err;
      })
      .finally(() => {
        loadingPromise = null;
      });

    return loadingPromise;
  };

  const findProvince = (data, provinceCode) =>
    data.find((p) => String(p.code) === String(provinceCode)) || null;

  const findDistrict = (province, districtCode) => {
    const districts = Array.isArray(province?.districts) ? province.districts : [];
    return districts.find((d) => String(d.code) === String(districtCode)) || null;
  };

  const getProvinces = async () => (await load()).map((p) => ({ code: p.code, name: p.name }));

  const getDistrictsByProvince = async (provinceCode) => {
    const province = findProvince(await load(), provinceCode);
    const districts = Array.isArray(province?.districts) ? province.districts : [];
    return districts.map((d) => ({ code: d.code, name: d.name }));
  };

  const getWardsByDistrict = async (provinceCode, districtCode) => {
    const province = findProvince(await load(), provinceCode);
    const district = findDistrict(province, districtCode);
    const wards = Array.isArray(district?.wards) ? district.wards : [];
    return wards.map((w) => ({ code: w.code, name: w.name }));
  };

  const setPlaceholder = (selectEl, placeholder) => {
    selectEl.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = placeholder;
    selectEl.appendChild(opt);
  };

  const populateProvinces = async (
    selectEl,
    placeholder = "Chọn Tỉnh/Thành phố",
    selectedCode
  ) => {
    if (!selectEl) return;
    setPlaceholder(selectEl, placeholder);
    const provinces = await getProvinces();
    provinces.forEach((p) => {
      const opt = document.createElement("option");
      opt.value = p.code;
      opt.textContent = p.name;
      if (selectedCode != null && String(selectedCode) === String(p.code)) opt.selected = true;
      selectEl.appendChild(opt);
    });
  };

  const populateDistricts = async (
    selectEl,
    provinceCode,
    placeholder = "Chọn Quận/Huyện",
    selectedCode
  ) => {
    if (!selectEl) return;
    setPlaceholder(selectEl, placeholder);
    if (!provinceCode) return;
    const districts = await getDistrictsByProvince(provinceCode);
    districts.forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d.code;
      opt.textContent = d.name;
      if (selectedCode != null && String(selectedCode) === String(d.code)) opt.selected = true;
      selectEl.appendChild(opt);
    });
  };

  const populateWards = async (
    selectEl,
    provinceCode,
    districtCode,
    placeholder = "Chọn Phường/Xã",
    selectedCode
  ) => {
    if (!selectEl) return;
    setPlaceholder(selectEl, placeholder);
    if (!provinceCode || !districtCode) return;
    const wards = await getWardsByDistrict(provinceCode, districtCode);
    wards.forEach((w) => {
      const opt = document.createElement("option");
      opt.value = w.code;
      opt.textContent = w.name;
      if (selectedCode != null && String(selectedCode) === String(w.code)) opt.selected = true;
      selectEl.appendChild(opt);
    });
  };

  const bindAddressDropdowns = (citySelect, districtSelect, wardSelect) => {
    if (!citySelect || !districtSelect || !wardSelect) return;
    if (citySelect.dataset.bound === "1") return;
    citySelect.dataset.bound = "1";

    citySelect.addEventListener("change", async (e) => {
      const provinceCode = e.target.value;
      await populateDistricts(districtSelect, provinceCode);
      await populateWards(wardSelect, "", "");
    });

    districtSelect.addEventListener("change", async (e) => {
      const provinceCode = citySelect.value;
      const districtCode = e.target.value;
      await populateWards(wardSelect, provinceCode, districtCode);
    });
  };

  const initDropdowns = async ({
    citySelect,
    districtSelect,
    wardSelect,
    defaultProvinceCode,
    defaultDistrictCode,
    defaultWardCode,
  } = {}) => {
    if (!citySelect || !districtSelect || !wardSelect) return;
    await populateProvinces(citySelect, "Chọn Tỉnh/Thành phố", defaultProvinceCode);
    await populateDistricts(districtSelect, citySelect.value, "Chọn Quận/Huyện", defaultDistrictCode);
    await populateWards(wardSelect, citySelect.value, districtSelect.value, "Chọn Phường/Xã", defaultWardCode);
    bindAddressDropdowns(citySelect, districtSelect, wardSelect);
  };

  window.vnAddressService = {
    load,
    initDropdowns,
    getProvinces,
    getDistrictsByProvince,
    getWardsByDistrict,
    populateProvinces,
    populateDistricts,
    populateWards,
    bindAddressDropdowns,
  };
})();
