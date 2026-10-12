/** Logo: WANTA in SK Pupok Solid. */
export interface WordmarkProps { pill?: boolean; avatar?: string; scale?: number; href?: string; className?: string }
export interface NavItem { id: string; label: string; href?: string; external?: boolean }
export interface TocItem { id: string; label: string }
/** Two-level sidebar: site sections + on-this-page outline. */
export interface FormatSwitchProps { value?: "human" | "agent"; onChange?: (v: "human" | "agent") => void; humanHref?: string; agentHref?: string; humanLabel?: string; agentLabel?: string }
export interface SideNavProps { format?: "human" | "agent"; onFormat?: (v: "human" | "agent") => void; agentHref?: string; items: NavItem[]; active?: string; toc?: TocItem[]; activeToc?: string; tocLabel?: string; collapsed?: boolean; onTocClick?: (id: string) => void; homeHref?: string; className?: string }
export interface ButtonProps { variant?: "primary" | "secondary"; href?: string; external?: boolean; onClick?: () => void; children: React.ReactNode; className?: string }
export interface AnnounceProps { children: React.ReactNode; actionLabel?: string; href?: string }
export interface CopyFieldProps { label: string; value: string; hint?: string; doneLabel?: string; menu?: { label: string; href: string }[]; menuTitle?: string; menuLabel?: string }
/** Generative duotone plate with saved-place patches. */
export interface PlateProps { seed?: number; patches?: number; focus?: boolean; caption?: string[]; alt?: string; className?: string }
export interface GlyphProps { kind?: "save" | "near" | "act"; size?: number; seed?: number; alt?: string; className?: string }
export interface FeatureRowProps { glyph: "save" | "near" | "act"; title: string; children: React.ReactNode; seed?: number }
