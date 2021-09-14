import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

	id: string;

  	constructor(private route: ActivatedRoute) { }

	ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.id = params['id'];
        });
    }

}
