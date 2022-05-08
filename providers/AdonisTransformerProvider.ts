import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Transformer from '../src'
import TransformerAbstract from '../src/TransformerAbstract'
import { HttpContextConstructorContract } from '@ioc:Adonis/Core/HttpContext'

declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    transform?: any
  }
}

export default class AppProvider {
  public static needsApplication = true

  constructor (protected app: ApplicationContract) {
  }

  public register (): void {
    // Register your own bindings
    this.app.container.singleton(
      'Adonis/Addons/Transformer',
      () => ({
        TransformerAbstract,
        Transformer,
      })
    )
  }

  public boot () {
    // IoC container is ready
    const Context: HttpContextConstructorContract = this.app.container.use('Adonis/Core/HttpContext')
    Context.getter(
      'transform',
      () => {
        return Transformer.create().withContext(this)
      },
      true
    )
  }

  public shutdown () {
    // Cleanup, since app is going down
  }

  public ready () {
    // App is ready
  }
}
