export interface RegistrationType {
  id: string
  type: string
  active: boolean
}
export interface SubDivision {
  id: string
  countryCode: string
  subdivisionCode: string
  name: string
  active: boolean
  type: string
}
export interface EntityType {
  id: string
  type: string
  active: boolean
}
export type MultiLevelObject<Value = any> = {
  [key: string]: Value | MultiLevelObject<Value>
}
