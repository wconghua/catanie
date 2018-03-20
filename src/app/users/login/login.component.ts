import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as ua from 'state-management/actions/user.actions';
import * as selectors from 'state-management/selectors';
import { Message, MessageType } from 'state-management/models';

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

import { environment } from '../../../environments/environment';

/**
 * Component to handle user login. Allows for AD and
 * functional account login.
 * @export
 * @class LoginComponent
 */
@Component({selector: 'login-form', templateUrl: './login.component.html'})
export class LoginComponent implements OnInit {

  returnUrl: string;
  postError = '';
  captchaPassed = false;
  captchaKey;
  show = false;

  loading$;

  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: true
  });

  /**
   * Creates an instance of LoginComponent.
   * @param {FormBuilder} fb - generates model driven user login form
   * @param {Router} router - handles page nav
   * @param {ActivatedRoute} route - access parameters in URL
   * @param {Store<any>} store
   * @memberof LoginComponent
   */
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>
  ) {
    this.captchaKey = environment['captchaKey'];
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loading$ = this.store.select(selectors.users.getLoading);
    this.store.select(selectors.users.getCurrentUser)
    .subscribe(result => {
      console.log(result);
      if (result && result['username']) {
        this.router.navigateByUrl('/datasets');
        // self.router.navigateByUrl(decodeURIComponent(self.returnUrl));
      } else if (result && result['errSrc']) {
        const msg = new Message();
        msg.content = result.message;
        msg.type = MessageType.Error;
        this.store.dispatch(new ua.ShowMessageAction(msg));
      } else if (!(result instanceof Object)) {
        const msg = new Message();
        msg.content = result;
        msg.type = MessageType.Error;
        this.store.dispatch(new ua.ShowMessageAction(msg));
      }
    });

    

    if (environment['captchaKey'] === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI') {
      // development key: https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha-v2-what-should-i-do
      this.captchaPassed = true;
    }
  }

  ngOnInit() {}

  /**
   * Default to an Active directory login attempt initially. Fallback to `local`
   * accounts if fails
   * @param {any} event - form submission event (not currently used)
   * @memberof LoginComponent
   */
  doADLogin(event) {
    const form: LoginForm = this.loginForm.value;
    if (this.captchaPassed) {
      this.store.dispatch(new ua.LoginAction(form));
    } else {
      const msg = new Message();
      msg.content = 'Please complete captcha first';
      msg.type = MessageType.Error;
      this.store.dispatch(new ua.ShowMessageAction(msg));
    }
  }

  handleCorrectCaptcha(event) {
    this.captchaPassed = true;
  }
}
