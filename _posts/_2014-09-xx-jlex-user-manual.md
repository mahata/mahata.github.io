---
layout: post
title: JLex User Manual Translation (Japanese)
category: JLex
---

この記事は[JLex User Manual](https://www.cs.princeton.edu/~appel/modern/java/JLex/current/manual.html)の日本語翻訳です。誤訳などは [Pull Request](https://github.com/mahata/mahata.github.io) で指摘していただけると助かります。

## はじめに

字句解析器は入力文字をトークンに分割します。字句解析器を手で書くのは面倒なので、その作業を簡潔化するためのツールが開発されてきした。

その中でもよく知られているものは Lex でしょう。Lex は UNIX で動作する字句解析器の生成ツールです。Lex は字句解析の仕様が記述された、あるフォーマットにもとづいたファイルを読み込み、C言語の字句解析器を生成します。

JLex ユーティリティは Lex モデルを基礎にしています。JLex は Lex に似た仕様ファイルを読み込み、字句解析器に該当する Java のソースコードを出力します。

## JLex 仕様

JLex の入力ファイルは3つのセクションから成ります。それぞれのセクションは `%%` で区切られます。JLex の入力ファイルのフォーマットは次のとおりです。

```
ユーザーコード
%%
JLex ディレクティブ
%%
正規表現ルール
```

`%%` ディレクティブは行の先頭にある必要があります。`%%` ディレクティブから行末までの入力は無視されます。

最初のセクションであるユーザーコードの部分は出力ファイルにコピーされます。ここにはユーティリティクラスや、字句解析器が返すオブジェクトの型宣言などを書きます。

二番目は JLex ディレクティブのセクションです。ここにはマクロ定義や字句解析器が持つ状態の情報について書きます。

三番目のセクションには字句解析のルールを書きます。それぞれのルールは、状態リスト (オプション)、正規表現、それに対応するアクションの3つの要素から成ります。

### ユーザーコード

ユーザーコードは一番最初の `%%` ディレクティブより前に書きます。ユーザーコードは JLex の出力である字句解析器ファイルの先頭に逐語的にコピーされます。字句解析器ファイルにパッケージ宣言や外部クラスの読み込みなどを記述したければ、ユーザーコードにそれらを書くことで実現できます。

### JLex ディレクティブ

JLex ディレクティブのセクションは最初の `%%` の後から二番目の `%%` までです。 (ToDo)

#### 字句解析器クラスへ埋め込まれるコード

`%{...%}` ディレクティブに書かれた Java コードは字句解析器クラスにコピーされます。次のようにして使います。

```
%{ 
<code> 
%}
```

`%{` と `%}` はどちらも行の先頭に置かなければなりません。間に挟まれた `<code>` の部分が JLex の生成する字句解析器クラスにコピーされます。

```
class Yylex { 
... <code> ... 
}
```

これにより変数や関数の宣言を字句解析クラスに埋め込めます。生成される字句解析クラスと重複する可能性があるため、"yy" で始まる変数名は避けるべきです。

#### 字句解析クラスのための初期化コード

`%init{ ... %init}` ディレクティブに書かれた Java コードは字句解析器クラスのコンストラクタにコピーされます。

```
%init{ 
<code>
%init}
```

`%init{` と `%init}` は行頭に書きます。`<code>` の部分が字句解析器クラスのコンストラクタにコピーされます。

```
class Yylex { 
Yylex () { 
... <code> ... 
} 
}
```

このディレクティブを使い、字句解析器クラスのコンストラクタでの初期化が可能です。yy で始まる変数名は生成される字句解析器クラスのために予約されているので避けましょう。

`%init{ ... %init}` に置かれたコードは例外を投げる可能性があります。この例外を宣言するには `%initthrow{ ... $initthrow}` ディレクティブを使います。

```
%initthrow{ 
<exception[1]>[, <exception[2]>, ...]
%initthrow}
```

ここに書かれた Java コードは字句解析器のコンストラクタにコピーされます。

```
Yylex () 
throws <exception[1]>[, <exception[2]>, ...]
{ 
... <code> ... 
}
```

`%init{ ... %init}` に書かれた Java コードが宣言されていない例外を投げる場合、字句解析器のコンパイルに失敗する可能性があります。

#### 字句解析クラスの End-of-File コード

`%eof{ ... %eof}` ディレクティブに書いたコードは、字句解析クラスが end-of-file にたどり着いたときの処理に使われます。

```
%eof{ 
<code>
%eof}
```

`%eof{` と `%eof}` ディレクティブは行頭に書きます。`<code>` に書かれた Java コードは字句解析器が入力ファイルの end-of-file に到達するとすぐ、多くとも一度だけ実行されます。

`%eof{ ... %eof}` に置かれたコードは例外を投げる可能性があります。この例外を宣言するには `%eofthrow{ ... $eofthrow}` ディレクティブを使います。

```
%eofthrow{ 
<exception[1]>[, <exception[2]>, ...]
%eofthrow}
```

ここに書かれた Java コードは字句解析関数にコピーされ、end-of-file に到達したときの後始末のための処理をします。

```
private void yy_do_eof () 
throws <exception[1]>[, <exception[2]>, ...]
{ 
... <code> ... 
}
```

The Java code in <code> that makes up the body of this function will, in part, come from the code given in the %eof{ ... %eof} directive. If this code throws an exception that is not declared using the %eofthrow{ ... %eofthrow} directive, the resulting lexer may not compile successfully.

`<code>` に置かれる Java コードの一部は `%eof{ ... %eof}` に書かれたコードになります。このコードが `%eofthrow{ ... %eofthrow}` で宣言していない例外を投げるとき、字句解析器のコンパイルに失敗する可能性があります。

#### Dummy

(Work In Progress)

## Credits and Copyrights

### Credits

The treatment of lexical analyzer generators given in Alan Holub's Compiler Design in C (Prentice-Hall, 1990) provided a starting point for my implementation.

Discussions with Professor Andrew Appel of the Princeton University Computer Science Department provided guidance in the design of JLex.

Java is a trademark of Sun Microsystems Incorporated.

### Copyright

JLex COPYRIGHT NOTICE, LICENSE AND DISCLAIMER.

Copyright 1996 by Elliot Joel Berk.

Permission to use, copy, modify, and distribute this software and its documentation for any purpose and without fee is hereby granted, provided that the above copyright notice appear in all copies and that both the copyright notice and this permission notice and warranty disclaimer appear in supporting documentation, and that the name of Elliot Joel Berk not be used in advertising or publicity pertaining to distribution of the software without specific, written prior permission.

Elliot Joel Berk disclaims all warranties with regard to this software, including all implied warranties of merchantability and fitness. In no event shall Elliot Joel Berk be liable for any special, indirect or consequential damages or any damages whatsoever resulting from loss of use, data or profits, whether in an action of contract, negligence or other tortious action, arising out of or in connection with the use or performance of this software.
