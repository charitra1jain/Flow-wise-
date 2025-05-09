export interface SurveyResponse {
  Timestamp: string
  Consent: string
  ProductType: string
  Discomfort: string
  ChangedProduct: string
  FactorsConsidered: string
  WillingToTry: string
  CostInfluence: string
  PreventionFactors: string
  PlasticPadChallenges: string
  InformationSources: string
  AwarenessOfHarm: string
  ContinueUsingPlastic: string
  WillingToShift: string
  CleaningPractices: string
  ConsultedHealthcare: string
  HygieneKnowledge: string
  DisposalMethod: string
  InfectionType: string
  InfectionsFromPlastic: string
  AvailabilityAtWork: string
  ProductsPerDay: string
  ChangeFrequency: string
  HygieneLevel: string
  PeriodDuration: string
  PhysiologicalIssues: string
  Age: string
  PCOS: string
}

export async function fetchSurveyData(): Promise<SurveyResponse[]> {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy%20of%20An_online_survey_on_Decoding_Menstrual_hygiene_product_choices_%28Responses%29%281%29-tlQ4ZYOL8B61NURzGEF6NjYfNlCtWa.csv",
    )
    const csvText = await response.text()

    // Parse CSV
    const rows = csvText.split("\n")
    const headers = rows[0].split(",").map((header) => header.trim().replace(/^"|"$/g, ""))

    const data: SurveyResponse[] = []

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue

      // Handle commas within quoted fields
      const row = rows[i]
      const values: string[] = []
      let inQuotes = false
      let currentValue = ""

      for (let j = 0; j < row.length; j++) {
        const char = row[j]

        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          values.push(currentValue.trim().replace(/^"|"$/g, ""))
          currentValue = ""
        } else {
          currentValue += char
        }
      }

      values.push(currentValue.trim().replace(/^"|"$/g, ""))

      // Map to response object
      const response: Partial<SurveyResponse> = {}

      response.Timestamp = values[0] || ""
      response.Consent = values[1] || ""
      response.ProductType = values[2] || ""
      response.Discomfort = values[3] || ""
      response.ChangedProduct = values[4] || ""
      response.FactorsConsidered = values[5] || ""
      response.WillingToTry = values[6] || ""
      response.CostInfluence = values[7] || ""
      response.PreventionFactors = values[8] || ""
      response.PlasticPadChallenges = values[9] || ""
      response.InformationSources = values[10] || ""
      response.AwarenessOfHarm = values[11] || ""
      response.ContinueUsingPlastic = values[12] || ""
      response.WillingToShift = values[13] || ""
      response.CleaningPractices = values[14] || ""
      response.ConsultedHealthcare = values[15] || ""
      response.HygieneKnowledge = values[16] || ""
      response.DisposalMethod = values[17] || ""
      response.InfectionType = values[18] || ""
      response.InfectionsFromPlastic = values[19] || ""
      response.AvailabilityAtWork = values[20] || ""
      response.ProductsPerDay = values[21] || ""
      response.ChangeFrequency = values[22] || ""
      response.HygieneLevel = values[23] || ""
      response.PeriodDuration = values[24] || ""
      response.PhysiologicalIssues = values[25] || ""
      response.Age = values[26] || ""
      response.PCOS = values[27] || ""

      data.push(response as SurveyResponse)
    }

    return data
  } catch (error) {
    console.error("Error fetching survey data:", error)
    return []
  }
}

export function countResponses(data: SurveyResponse[], field: keyof SurveyResponse): Record<string, number> {
  const counts: Record<string, number> = {}

  data.forEach((response) => {
    const value = response[field]
    if (value) {
      counts[value] = (counts[value] || 0) + 1
    }
  })

  return counts
}

export function getMultiSelectCounts(data: SurveyResponse[], field: keyof SurveyResponse): Record<string, number> {
  const counts: Record<string, number> = {}

  data.forEach((response) => {
    const value = response[field]
    if (value) {
      // Split by commas or other separators as needed
      const options = value.split(/,\s*/)

      options.forEach((option) => {
        if (option.trim()) {
          counts[option.trim()] = (counts[option.trim()] || 0) + 1
        }
      })
    }
  })

  return counts
}
