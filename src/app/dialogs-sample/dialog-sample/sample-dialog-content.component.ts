import { Component } from '@angular/core';

@Component({
  template: `
      <p>
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos
          dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
          mollitia animi, id est laborum et dolorum fuga.
          <br/>
          <br/>
          Et harum quidem rerum facilis est et expedita distinctio.
          <br/>
          <br/>
          Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus,
          omnis voluptas assumenda est, omnis dolor repellendus.
          <br/>
          <br/>
          Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint
          et molestiae non recusandae.
          <br/>
          <br/>
          Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis
          doloribus asperiores repellat.
      </p>
  `,
  styles: [
      `:host {
          width: 400px;
      }`
  ]
})
export class SampleDialogContentComponent {
}
