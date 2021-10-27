import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RECIPES } from 'test_data/db-recipes';
import { RecipeCardComponent } from './recipe-card.component';


describe('RecipeCardComponent', () => {
  let component: RecipeCardComponent;
  let fixture: ComponentFixture<RecipeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeCardComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCardComponent);
    component = fixture.componentInstance;
    component.recipe = RECIPES[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
