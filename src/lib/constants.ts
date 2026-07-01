export const SITE_CONFIG = {
  name: "Este Supply",
  tagline: "Mayorista B2B · Ciudad del Este",
  description:
    "Plataforma mayorista B2B en Ciudad del Este, Paraguay. Tecnología, electrónica, repuestos y bazar para empresas en Paraguay, Brasil y Argentina.",
  location: "Ciudad del Este, Paraguay",
  address: "Microcentro, Ciudad del Este, Paraguay",
  email: "ventas@estesupply.com.py",
  phone: "+595 61 500 000",
  whatsapp: "59561500000",
} as const;

export const CATEGORY_NAV = [
  { label: "Tecnología", href: "/productos?categoria=tecnologia" },
  { label: "Electrónica", href: "/productos?categoria=electronica" },
  { label: "Repuestos", href: "/productos?categoria=repuestos" },
  { label: "Bazar", href: "/productos?categoria=bazar" },
] as const;

export const NAV_LINKS = [
  { label: "Catálogo", href: "/productos" },
  { label: "Categorías", href: "/#categorias" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Contacto", href: "/#contacto" },
] as const;

export const AVAILABILITY_LABEL = "Disponible para pedido" as const;
