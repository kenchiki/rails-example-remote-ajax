# indexにフォームを設置してajaxで送信してバリデーションエラーを表示し、成功ならリダイレクトする
- 記事にコメントを投稿するような場合に効果的
- 編集を作るのは大変なので、削除だけできれば良い

## 導入までの手順
- Gemfileに`gem 'webpacker', '~> 4.0'`を追記してbundle install
- `brew install yarn`でyarn導入
- `bundle exec rails webpacker:install`（rubymineのgenerateでコマンドがなぜか出ないのでterminalから下記を叩く）
- `bundle exec rails webpacker:install:vue`

上記のコマンドにより`app/javascript/packs`にhello worldファイルが作成される。
ちなみに`rails-example-vue-crud\config\webpacker.yml`に`app/javascript/packs`に
vueファイルを作るように書いているのが分かる

- 開発中はsshで`ruby ./bin/webpack-dev-server`する必要があると思っていたがrails sの状態だったら自動的にコンパイルもしてくれた（webpacker4）

```haml
-#app/views/layouts/application.html.haml

-#app/javascript/packs/application.jsを他のJSまとめるファイルにして他のJSをimport './works'みたいにして束ねて使う
-#vueのテンプレートを表示する場合はhamlの表示したい箇所に`= javascript_pack_tag 'hello_vue'`
= javascript_pack_tag 'application', 'data-turbolinks-track': 'reload'
```

## railsの定数などをJSファイルに引っ張る方法

```sh
bundle exec rails webpacker:install:erb
```

```javascript
// app/javascript/packs/works.js.erb

// フィールドの入力数制限
cocoonAddLimit(jsWorkImages, <%= Work::IMAGE_LIMIT %>);
```

```javascript
// app/javascript/packs/application.js

import './works.js.erb'
```

## IE対応

```javascript
// app/javascript/packs/application.js

// IE対応する場合（参考：https://github.com/rails/webpacker/blob/master/docs/es6.md）
import "@babel/polyfill"
```

## remote: trueのイベントをvueで拾う

```ruby
# controllers/articles_controller.rb

# javascript/packs/modules/article_new.jsがJSONを受け取ってDOMを生成する
# status: :unprocessable_entityで422が返り、ajax:errorのイベントを捕捉する（remote: trueの仕様）
render json: @article.errors.full_messages, status: :unprocessable_entity
```

```haml
-# articles/_form.html.haml

-# 下記のフォームはid="new_article"が割り当てられる
= simple_form_for(@article, remote: true, html: {'v-on:ajax:error': 'errors_show'} ) do |f|
```

```javascript
// javascript/packs/modules/article_new.js

methods: {
  errors_show: function (event) {
    this.errors = event.detail[0];
    // event.target.querySelector('#article_title').style.backgroundColor = '#ff0000';のようにevent.targetでid="new_article"のDOMのスコープを拾うことができる
  }
}
```

## 自動でJSを読み込む

```javascript
// javascript/packs/application.js

document.addEventListener('turbolinks:load', () => {
  function allRequire(context) {
    context.keys().forEach(function (value) {
      let obj = context(value);
      obj.default(Vue)
    });
  }
  allRequire(require.context('./modules/', false, /\.js$/))
})
```

## turbolinksとvueを同時に使う

### 下記のライブラリが必要になる
- `yarn add 'vue-turbolinks'`

```javascript
import TurbolinksAdapter from 'vue-turbolinks';
Vue.use(TurbolinksAdapter)
```

### 参考
- vue導入時に生成される`hello_vue.vue`にコメントとしてvue-turbolinksのことが記載されているので見る
- [https://github.com/jeffreyguenther/vue-turbolinks](https://github.com/jeffreyguenther/vue-turbolinks)
