"use client";
import { useCallback } from "react";

// Tablo işlevlerini içeren bir özel kancayı oluşturdum
export const TableFunctions = ({
  columns,
  visible,
  data,
  filters,
  pagination,
  page,
  sorting,
  setFilters,
  setSorting,
  setSelection,
  isSelectedAll,
}) => {
  // Headerları filterlar ve filterlanmış datayı return eder
  const getHeaders = useCallback(() => {
    return (
      columns
        // eğer ki header'ın hide valuesu false ise geçmesine izin ver eğerki true ise geçişini engelle bu şekilde gizli başlıklar oluşturuluyor
        .filter((col) => !col.hide)
        // visible statinde bu başlık var ise veya hiç tanımlı değilse geçmesine izin ver eğerki hi tanımlı ve false ise geçişine izin verme
        .filter((col) => visible[col.dt_name] ?? true)
    );
  }, [columns, visible]);

  // Filterları istediğimiz yerde istediğimiz data uygulamak için bir fonksiyon içerisine bir object alır ve tablo component'ının içerisinde ki filter state'i içerisinde ki global ve column değerlerini kullanarak filterlama işlemlerini uygular
  const applyFilters = useCallback(
    (item) => {
      // datada ki tüm valueları gezer ve 1 tanesinde bile bir eşleşme var ise true olarak döner.
      const globalSearch = () =>
        Object.values(item).some((value) =>
          !value
            ? false
            : value
                .toString()
                .toLowerCase()
                .includes(filters.global.toLowerCase())
        );

      // dışarıdan başlık ismi ve o başlıkta aranacak kelimeyi alır eğerki başlığın filterType'ı include ise içerisinde o string var mı bunu arar eğer ki equal ise eşitlik sağlıyor mu buna bakar.
      const columnSearch = (columnName, filterValue) => {
        const column = columns?.find((col) => col.dt_name === columnName);
        if (column) {
          const filterType = column?.filter;

          if (item[columnName]?.id) {
            return (
              item[columnName][column?.selectableField].toLowerCase() ===
              filterValue.toLowerCase()
            );
          } else if (filterType === "include") {
            return item[columnName]
              .toLowerCase()
              .includes(filterValue.toLowerCase());
          } else if (filterType === "equal") {
            return item[columnName].toLowerCase() === filterValue.toLowerCase();
          }
        }
        return true;
      };

      // eğer ki global search'den ve column search'den geçebilirse bu fonksiyondan true döner, return : boolean
      return (
        globalSearch() &&
        filters.columns.every((colFilter) =>
          columnSearch(
            Object.keys(colFilter)[0],
            colFilter[Object.keys(colFilter)[0]]
          )
        )
      );
    },
    [filters, columns]
  );

  // Ham datayı filterlardan geçirerek kullanılacak datayı almak için bir fonksiyon
  const getRows = useCallback(() => {
    let filteredData = data;

    // Filtreleri uygula
    filteredData = filteredData.filter((item) => applyFilters(item));

    // Sıralamayı uygula
    if (sorting.id && sorting.value) {
      const column = columns.find((col) => col.header === sorting.id);
      if (column) {
        const comparator = (a, b) => {
          const aValue = a[column.dt_name];
          const bValue = b[column.dt_name];
          return sorting.value === "asc"
            ? aValue > bValue
              ? 1
              : -1
            : aValue < bValue
            ? 1
            : -1;
        };

        filteredData = filteredData.sort(comparator);
      }
    }

    // Sayfalama uygula
    if (pagination) {
      filteredData = filteredData.slice(
        page.pageIndex * page.pageSize,
        (page.pageIndex + 1) * page.pageSize
      );
    }

    return filteredData;
  }, [data, pagination, applyFilters, page, sorting, columns]);

  // Belirli bir sütun için benzersiz değerleri almak için bir fonksiyon
  const getUniqueValues = (columnName, data, engineField) => {
    // new Set() ile verinin içerisinde aynı stringlerin olmasını engelliyoruz
    const uniqueValues = new Set();

    data?.forEach((item) => {
      if (item[columnName] !== undefined) {
        if (item[columnName]?.id) {
          uniqueValues.add(
            item[columnName][engineField]?.toString()?.toLowerCase()
          );
        } else {
          uniqueValues.add(item[columnName]?.toString()?.toLowerCase());
        }
      }
    });

    // uniqueValues verisini bir arraya çevir ve return et
    return Array.from(uniqueValues);
  };

  // Belirli bir sütundaki benzersiz değerleri almak için bu fonksiyonu kullanıyoruz. getUniqueValues fonksiyonunu kullanıyor
  const uniqueValues = (columnName, engineField) => {
    const uniqueValuesByColumn = {};

    uniqueValuesByColumn[columnName] = getUniqueValues(
      columnName,
      data,
      engineField
    );

    return uniqueValuesByColumn[columnName];
  };

  // name: column name, val: column filter value, bu fonksiyon column search kısmındaki select in her value değişikliğinde çalışacak olan fonksiyon.
  const changeFilter = (name, val) => {
    // eğer ki seçilen value all ise filter datamın içerisinden o kısmı tamamen çıkar
    // eğer ki seçilen value all değil ise datanın içereisinde ki [name] in valuesunu value ya eşitle yani ->  [name]: value

    setFilters((prevFilters) => {
      const updatedColumns = prevFilters.columns.filter(
        (col) => Object.keys(col)[0] !== name
      );

      const withoutAllFilter = updatedColumns.filter(
        (col) => Object.values(col)[0] !== null
      );

      const newColumns =
        val !== "all"
          ? [...withoutAllFilter, { [name]: val }]
          : withoutAllFilter;

      return {
        ...prevFilters,
        columns: newColumns,
      };
    });
  };

  // tüm verinin içerisinde gez ve hepsinin selectiondaki değerini hepsi zaten seçili ise false değil ise true yap
  const selectAll = (val) => {
    const filteredRows = getRows();
    const newSelection = {};

    if (isSelectedAll()) {
      // If already selected, unselect all filtered rows
      filteredRows.forEach((row, index) => {
        newSelection[row?.id] = false;
      });
    } else {
      // If not already selected, select all filtered rows
      filteredRows.forEach((row, index) => {
        newSelection[row?.id] = true;
      });
    }

    setSelection(newSelection);
  };

  // sıralanabilir bir columna tıklanıldığında asc ise desc desc ise asc yapmak için var bu fonksiyon
  const changeSorting = (column) => {
    if (column?.header !== sorting?.id) {
      setSorting({
        id: column.header,
        value: "asc",
      });
    } else if (column?.header === sorting?.id) {
      setSorting((prevState) => ({
        ...prevState,
        value: prevState?.value === "asc" ? "desc" : "asc",
      }));
    }
  };

  // Dışa açılan fonksiyonları döndür
  return {
    uniqueValues,
    getHeaders,
    getRows,
    applyFilters,
    changeFilter,
    changeSorting,
    selectAll,
  };
};

/*
header: header bir string veya bir number alır tablo başlığı olarak kullanılır.
dt_name: bu value başlığın datadan hangi key ile veri çekeceğini belirtir bir string alır.
sortable: bu başlık altındaki veriler sıralamaya tabi tutulacak mı? sıralama olacak mı?
filter: "include" yada "equal" alır içerisinde olması yeterli mi yoksa eşit mi olacak bunu kontrol eder.
enableForm: Data ekleme modalında görünecek mi (bir input olarak)
type: Data ekleme modalında olan inputun type'ını belirtir "text", "email", "number" vb...
translate: Data ekleme modalında ki ekstra dil ekleme özelliklerini kullanacak mı?
hide: true ise tabloda görünmez.
columnFilter: select ile bir filterlama işlemi yapılacak mı?
cell: () => {}, bir component alır içerisine ve bu headerın altındaki verilerde bu component'ı kullanır tüm datayı props olarak alır.
 */

// Test için kullanılan sütunlar

export const StoreColumn = [
  {
    header: "ID",
    dt_name: "id",
    sortable: true,
    enableForm: false,
    hide: true,
  },
  {
    header: "Store Name",
    dt_name: "name",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
  {
    header: "Sirket Bilgisi",
    dt_name: "company",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: false,
    columnFilter: true,
    engine: "prisma",
    table: "Company",
    selectableField: "name",
  },
  {
    header: "Country",
    dt_name: "country",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
  {
    header: "State",
    dt_name: "state",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
  {
    header: "Phone Number",
    dt_name: "phone_number",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: false,
  },
  {
    header: "Maximum Discount Rate",
    dt_name: "maximum_discount_rate",
    filter: "include",
    enableForm: true,
    type: "number",
    translate: false,
  },
  {
    header: "Maximum Bonus Rate",
    dt_name: "maximum_bonus_rate",
    filter: "include",
    enableForm: true,
    type: "number",
    translate: false,
  },
  {
    header: "Description",
    dt_name: "description",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
];

export const personelColumn = (role) => {
  return [
    {
      header: "İsim",
      dt_name: "name",
      filter: "include",
      enableForm: true,
      type: "text",
      translate: true,
    },
    {
      header: "Soy İsim",
      dt_name: "surname",
      filter: "include",
      enableForm: true,
      type: "text",
      translate: true,
    },
    {
      header: "Telefon",
      dt_name: "phoneNumber",
      filter: "include",
      enableForm: true,
      type: "number",
      translate: false,
    },
    {
      header: "Adres",
      dt_name: "address",
      filter: "include",
      enableForm: true,
      type: "text",
      translate: true,
    },
    {
      header: "İndirim Oranı Max",
      dt_name: "maxTax",
      filter: "include",
      enableForm: true,
      type: "number",
      translate: false,
    },
    {
      header: "Maaş",
      dt_name: "salary",
      filter: "include",
      enableForm: true,
      type: "number",
      translate: false,
    },
    {
      header: "Prim",
      dt_name: "bonus",
      filter: "include",
      enableForm: true,
      type: "number",
      translate: false,
    },
    {
      header: "Yönetici Yorumu",
      dt_name: "managerComment",
      filter: "include",
      enableForm: true,
      type: "text",
      translate: true,
    },
    {
      header: "Personel Rolü",
      dt_name: "role",
      filter: "include",
      enableForm: role !== "personal" ? true : false,
      translate: true,
      columnFilter: true,
      type: `enum`,
      list: [
        // roles: 'personal', 'manager', 'company_manager'
        {
          title: `Company Manager`,
          role: "company_manager",
          roles: ["company_manager"],
        },
        {
          title: `Manager`,
          role: "manager",
          roles: ["company_manager", "manager"],
        },
        {
          title: `Personal`,
          role: "personal",
          roles: ["company_manager", "manager"],
        },
        {
          title: `customer`,
          role: "customer",
          roles: ["company_manager", "manager", "personal"],
        },
      ],
    },
    {
      header: "Mağaza Bilgisi",
      dt_name: "store",
      filter: "include",
      enableForm: true,
      type: "text",
      translate: false,
      columnFilter: true,
      engine: "prisma",
      table: "Store",
      selectableField: "name",
    },
    {
      header: "Ekleme Tarihi",
      dt_name: "createdAt",
      filter: "include",
    },
    {
      header: "Password",
      dt_name: "password",
      enableForm: true,
      type: "password",
      hide: true,
    },
  ];
};

export const companyColumn = [
  {
    header: "ID",
    dt_name: "id",
    sortable: true,
    enableForm: false,
    hide: true,
  },
  {
    header: "Sirket İsmi",
    dt_name: "name",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: false,
  },
  {
    header: "Yetkili İsmi",
    dt_name: "yetkili",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: false,
  },
  {
    header: "Telefon 1 ",
    dt_name: "tel1",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: false,
  },
  {
    header: "Telefon 2",
    dt_name: "tel2",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: false,
  },
  {
    header: "email1 1",
    dt_name: "email1",
    filter: "include",
    enableForm: true,
    type: "email",
    translate: false,
  },
  {
    header: "email 2",
    dt_name: "email2",
    filter: "include",
    enableForm: true,
    type: "email",
    translate: false,
  },
  {
    header: "Adres",
    dt_name: "address",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
  {
    header: "Vergi Numarası",
    dt_name: "vergino",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: false,
  },
  {
    header: "Banka",
    dt_name: "banka",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: false,
  },
  {
    header: "Banka Hesap Numarası",
    dt_name: "bankahesapno",
    filter: "include",
    enableForm: true,
    type: "number",
    translate: false,
  },
  {
    header: "Banka MFO",
    dt_name: "bankamfo",
    filter: "include",
    enableForm: true,
    type: "number",
    translate: false,
  },
  {
    header: "IBAN",
    dt_name: "iban",
    filter: "include",
    enableForm: true,
    type: "number",
    translate: false,
  },
  {
    header: "Ekstra 1",
    dt_name: "ekstra1",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
  {
    header: "Ekstra 2",
    dt_name: "ekstra2",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
  {
    header: "Ekstra 3",
    dt_name: "ekstra3",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
];

export const suplierColumn = [
  {
    header: "ID",
    dt_name: "id",
    sortable: true,
    enableForm: false,
  },
  {
    header: "Yetkili Ismi 1",
    dt_name: "yetkiliisim1",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
  {
    header: "Yetkili Telefon 1",
    dt_name: "yetkilitelefon1",
    filter: "include",
    enableForm: true,
    type: "number",
    translate: false,
  },
  {
    header: "Yetkili Email 1",
    dt_name: "yetkiliemail1",
    filter: "include",
    enableForm: true,
    type: "email",
    translate: false,
  },
  {
    header: "Yetkili Isim 2",
    dt_name: "yetkiliisim2",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
  {
    header: "Yetkili Telefon2",
    dt_name: "yetkilitelefon2",
    filter: "include",
    enableForm: true,
    type: "number",
    translate: false,
  },
  {
    header: "Yetkili Email 2",
    dt_name: "yetkiliemail2",
    filter: "include",
    enableForm: true,
    type: "email",
    translate: false,
  },
  {
    header: "Firma",
    dt_name: "firma",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
  {
    header: "Adres",
    dt_name: "adres",
    filter: "include",
    enableForm: true,
    type: "text",
    translate: true,
  },
  {
    header: "Vergi No",
    dt_name: "vergino",
    filter: "include",
    enableForm: true,
    type: "number",
    translate: false,
  },
  {
    header: "Şirket Tel",
    dt_name: "sirkettel",
    filter: "include",
    enableForm: true,
    type: "number",
    translate: false,
  },
  ,
  {
    header: "Şirket Email",
    dt_name: "sirketemail",
    filter: "include",
    enableForm: true,
    type: "email",
    translate: false,
  },
];

export const expenseColumns = (role) => {
  return [
    {
      header: "Mağaza Seçimi",
      dt_name: "store",
      filter: "include",
      enableForm: true,
      type: "enum",
      translate: false,
      list: [
        {
          title: "Mağaza A",
          role: "company_manager",
          roles: ["company_manager"],
        },
        {
          title: "Mağaza B",
          role: "company_manager",
          roles: ["company_manager"],
        },
        // Diğer mağaza isimleri buraya eklenebilir
      ],
    },
    {
      header: "Ödeme Yapılan Şirket Bilgileri",
      dt_name: "payment_company_info",
      filter: "include",
      enableForm: true,
      type: "text",
      translate: true,
    },
    {
      header: "Tarih",
      dt_name: "date",
      filter: "include",
      enableForm: true,
      type: "date",
      translate: false,
    },
    {
      header: "Ödeme Tipi",
      dt_name: "payment_type",
      filter: "include",
      enableForm: true,
      type: "enum",
      translate: false,
      list: [
        {
          title: "Banka",
          role: "company_manager",
          roles: ["company_manager"],
        },
        {
          title: "Nakit",
          role: "company_manager",
          roles: ["company_manager"],
        },
      ],
    },
    {
      header: "Gider İsmi",
      dt_name: "expense_name",
      filter: "include",
      enableForm: true,
      type: "text",
      translate: true,
    },
    {
      header: "Döviz Cinsi",
      dt_name: "currency",
      filter: "include",
      enableForm: true,
      type: "text",
      translate: true,
    },
    {
      header: "Kur Oranı",
      dt_name: "exchange_rate",
      filter: "include",
      enableForm: true,
      type: "number",
      translate: true,
    },
    {
      header: "Gider Tutarı",
      dt_name: "expense_amount",
      filter: "include",
      enableForm: true,
      type: "number",
      translate: true,
    },
    {
      header: "Açıklama",
      dt_name: "description",
      filter: "include",
      enableForm: true,
      type: "text",
      translate: true,
    },
  ];
};
