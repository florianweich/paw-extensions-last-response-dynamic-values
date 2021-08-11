/**
 * Our main extension class `LastResponseHeaderValue`.
 *
 * @since 1.0.0
 */
class LastResponseHeaderValue {
  /// User inputs
  static inputs = [InputField('header', 'Header', 'String')]

  /// Extension identifier (must be same as the directory name)
  static identifier = 'de.tmt.LastResponseHeaderValue'

  /// Display name for our Dynamic Value
  static title = 'Last Response Header'

  /// Link to the extension's documentation
  static help = 'https://www.tmt.de/'

  /// The evaluate() method generates the dynamic value
  evaluate(context) {
    /// Let's start empty
    let dynamicValue = ''

    /// Grab all requests
    const reqs = context.getAllRequests()

    /// Get all exchanges and sort requests by when the corresponding exchange was fired
    const allRequests = reqs
      .map((r) => {
        const e = r.getLastExchange()
        if (e) r.lastFired = e.date

        return r
      })
      .filter((e) => e.lastFired)
      .sort((a, b) => b.lastFired.getTime() - a.lastFired.getTime())

    /// Grab header value from the first exchange's response
    const request = allRequests[0]

    if (request) {
      const headers = request.getLastExchange().responseHeaders
      const namedHeader = headers[this.header]

      if (namedHeader) dynamicValue = namedHeader
    }

    return dynamicValue
  }
}

/// Call to register function is required
registerDynamicValueClass(LastResponseHeaderValue)
